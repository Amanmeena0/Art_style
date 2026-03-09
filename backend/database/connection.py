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


# Image processing function
async def process_images(style_bytes: bytes, content_bytes: bytes) -> bytes:
    """Process style transfer and return result bytes"""
    try:
        # Prepare images for model
        style_tensor, content_tensor = prepare_images(style_bytes, content_bytes)
        
        # Run style transfer
        result_bytes = run_style_transfer(content_tensor, style_tensor)
        
        return result_bytes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

# Image storage function
def store_images_in_db(
    style: UploadFile,
    content: UploadFile,
    style_bytes: bytes,
    content_bytes: bytes,
    result_bytes: bytes,
    session_id: str
) -> str:
    """Store all three images in database and return result_id"""
    try:
        upload_timestamp = datetime.utcnow()
        
        # Bulk insert all images at once
        documents = [
            {
                "filename": style.filename,
                "content_type": style.content_type,
                "data": Binary(style_bytes),       
                "type": "style",
                "size": len(style_bytes),
                "session_id": session_id,
                "uploaded_at": upload_timestamp
            },
            {
                "filename": content.filename,
                "content_type": content.content_type,
                "data": Binary(content_bytes),    
                "type": "content",
                "size": len(content_bytes),
                "session_id": session_id,
                "uploaded_at": upload_timestamp
            },
            {
                "filename": f"result_{session_id}.png",
                "content_type": "image/png",
                "data": Binary(result_bytes),      
                "type": "result",
                "size": len(result_bytes),
                "session_id": session_id,
                "created_at": upload_timestamp
            }
        ]

        results = collection.insert_many(documents)
        return str(results.inserted_ids[2])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage failed: {str(e)}")

# Main endpoint
@app.post("/process")
async def process_style_transfer(
    style: UploadFile = File(...), 
    content: UploadFile = File(...),
    store_result: bool = Form(False)
):
    """Upload images and process style transfer in one call"""
    try:
        session_id = str(uuid.uuid4())
        
        # Read image bytes directly - no database storage needed for processing
        style_bytes = await style.read()
        content_bytes = await content.read()
        
        # Process images
        result_bytes = await process_images(style_bytes, content_bytes)
        
        # Store in database if requested
        result_id = None
        if store_result:
            result_id = store_images_in_db(
                style, content, 
                style_bytes, content_bytes, 
                result_bytes, session_id
            )
        
        # Return result directly
        image_base64 = base64.b64encode(result_bytes).decode("utf-8")
        
        return {
            "message": "Style transfer completed",
            "session_id": session_id,
            "result_id": result_id,
            "image_data": f"data:image/png;base64,{image_base64}"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@app.get("/result/{session_id}")
async def get_result(session_id: str):
    """Fetch a previously stored result image"""
    try:
        result = collection.find_one({"session_id": session_id, "type": "result"})
        
        if not result:
            raise HTTPException(status_code=404, detail="Result not found")
        
        image_base64 = base64.b64encode(bytes(result["data"])).decode("utf-8")
        
        return {
            "session_id": session_id,
            "filename": result["filename"],
            "content_type": result["content_type"],
            "image_data": f"data:{result['content_type']};base64,{image_base64}",
            "created_at": result["created_at"].isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history")
async def get_history(limit: int = 10):
    """Get recent processed results"""
    try:
        results = collection.find(
            {"type": "result"}
        ).sort("created_at", -1).limit(limit)
        
        return [
            {
                "session_id": r["session_id"],
                "filename": r["filename"],
                "created_at": r["created_at"].isoformat()
            }
            for r in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)