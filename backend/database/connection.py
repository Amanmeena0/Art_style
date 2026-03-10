import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from database.preparastion import prepare_images
from models.pretrained_model import run_style_transfer
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import base64
import uuid
from datetime import datetime
from bson import Binary

load_dotenv()

mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME")

# ✅ FIX
if not mongo_url:
    raise ValueError("Missing MONGO_URL in .env file")
if not db_name:
    raise ValueError("Missing DB_NAME in .env file")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(mongo_url)
db = client[db_name]
try:
    client.admin.command('ping')
    print("✅ MongoDB connected successfully")
except Exception as e:
    raise RuntimeError(f"❌ Could not connect to MongoDB: {e}")

collection = db["images"]


@app.get("/")
async def root():
    return {"message": "FastAPI server is running"}


@app.post("/upload")
async def upload_images(
    content_image: UploadFile = File(...),
    style_image: UploadFile = File(...),
    session_id: str = Form(None)
):
    """
    Upload content and style images from frontend and store in MongoDB
    """
    try:
        # Generate session_id if not provided
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # Read image data
        content_data = await content_image.read()
        style_data = await style_image.read()
        
        # Validate file types
        allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
        if content_image.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Content image must be JPEG, PNG, or WebP")
        if style_image.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Style image must be JPEG, PNG, or WebP")
        
        # Delete existing images for this session (if re-uploading)
        collection.delete_many({"session_id": session_id, "type": {"$in": ["content", "style"]}})
        
        # Store content image
        content_doc = {
            "session_id": session_id,
            "filename": content_image.filename,
            "content_type": content_image.content_type,
            "type": "content",
            "size": len(content_data),
            "data": Binary(content_data),
            "uploaded_at": datetime.utcnow()
        }
        content_result = collection.insert_one(content_doc)
        
        # Store style image
        style_doc = {
            "session_id": session_id,
            "filename": style_image.filename,
            "content_type": style_image.content_type,
            "type": "style",
            "size": len(style_data),
            "data": Binary(style_data),
            "uploaded_at": datetime.utcnow()
        }
        style_result = collection.insert_one(style_doc)
        
        return {
            "success": True,
            "message": "Images uploaded successfully",
            "session_id": session_id,
            "content_image_id": str(content_result.inserted_id),
            "style_image_id": str(style_result.inserted_id)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload images: {str(e)}")


@app.get("/images/{session_id}")
async def get_images_by_session(session_id: str):
    """
    Get all images for a session
    """
    try:
        images = list(collection.find({"session_id": session_id}))
        if not images:
            raise HTTPException(status_code=404, detail="No images found for this session")
        
        result = []
        for img in images:
            result.append({
                "id": str(img["_id"]),
                "filename": img.get("filename"),
                "content_type": img.get("content_type"),
                "type": img.get("type"),
                "size": img.get("size", 0),
                "uploaded_at": str(img.get("uploaded_at")),
                "data_base64": base64.b64encode(img.get("data", b"")).decode("utf-8")
            })
        
        return {"session_id": session_id, "images": result}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch images: {str(e)}")


@app.delete("/images/{session_id}")
async def delete_images_by_session(session_id: str):
    """
    Delete all images for a session
    """
    try:
        result = collection.delete_many({"session_id": session_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="No images found for this session")
        
        return {
            "success": True,
            "message": f"Deleted {result.deleted_count} images",
            "session_id": session_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete images: {str(e)}")


@app.post("/process")
async def process_style_transfer(session_id: str = Form(...)):
    """
    Run style transfer on uploaded images for a session
    """
    try:
        # Fetch content and style images from MongoDB
        content_doc = collection.find_one({"session_id": session_id, "type": "content"})
        style_doc = collection.find_one({"session_id": session_id, "type": "style"})
        
        if not content_doc:
            raise HTTPException(status_code=404, detail="Content image not found for this session")
        if not style_doc:
            raise HTTPException(status_code=404, detail="Style image not found for this session")
        
        # Get image bytes
        content_data = bytes(content_doc["data"])
        style_data = bytes(style_doc["data"])
        
        # Prepare images for style transfer
        style_image, content_image = prepare_images(style_data, content_data)
        
        # Run style transfer
        result_bytes = run_style_transfer(content_image, style_image)
        
        # Delete existing result for this session
        collection.delete_many({"session_id": session_id, "type": "result"})
        
        # Store result image in MongoDB
        result_doc = {
            "session_id": session_id,
            "filename": "stylized_result.png",
            "content_type": "image/png",
            "type": "result",
            "size": len(result_bytes),
            "data": Binary(result_bytes),
            "created_at": datetime.utcnow()
        }
        result_insert = collection.insert_one(result_doc)
        
        # Return result as base64
        result_base64 = base64.b64encode(result_bytes).decode("utf-8")
        
        return {
            "success": True,
            "message": "Style transfer completed",
            "session_id": session_id,
            "result_image_id": str(result_insert.inserted_id),
            "result_base64": result_base64
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Style transfer failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)