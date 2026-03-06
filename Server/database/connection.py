from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import base64
import uuid
from datetime import datetime

load_dotenv()

mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME")

if not mongo_url or not db_name:
    raise ValueError("Missing MONGO_URL or DB_NAME in environment variables")

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
client.admin.command('ping')
collection = db["images"]


@app.get("/")
async def root():
    return {"message": "FastAPI server is running"}


@app.post("/upload")
async def upload_image(style: UploadFile = File(...), content: UploadFile = File(...)):
    try:
        session_id = str(uuid.uuid4())
        upload_timestamp = datetime.utcnow()
        
        contents1 = await style.read()
        image_data1 = {
            "filename": style.filename,
            "content_type": style.content_type,
            "data": contents1,
            "type": "style",
            "size": len(contents1),
            "session_id": session_id,
            "uploaded_at": upload_timestamp
        }
        result1 = collection.insert_one(image_data1)
        
        contents2 = await content.read()
        image_data2 = {
            "filename": content.filename,
            "content_type": content.content_type,
            "data": contents2,
            "type": "content",
            "size": len(contents2),
            "session_id": session_id,
            "uploaded_at": upload_timestamp
        }
        result2 = collection.insert_one(image_data2)
        
        return {
            "message": "Both images uploaded successfully",
            "session_id": session_id,
            "style": {
                "filename": style.filename,
                "size": len(contents1),
                "id": str(result1.inserted_id)
            },
            "content": {
                "filename": content.filename,
                "size": len(contents2),
                "id": str(result2.inserted_id)
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.post("/process/{session_id}")
async def process_style_transfer(session_id: str):
    """Process style transfer for given session"""
    try:
        from .loadimages import get_style_image, get_content_image
        from .preparastion import prepare_images
        from ..models.pretrained_model import run_style_transfer
        
        # Get images from database
        style_doc = get_style_image(session_id)
        content_doc = get_content_image(session_id)
        
        if not style_doc or not content_doc:
            raise HTTPException(status_code=404, detail="Images not found for session")
        
        # Prepare images for model
        style_tensor, content_tensor = prepare_images(
            style_doc["data"],
            content_doc["data"]
        )
        
        # Run style transfer
        result_bytes = run_style_transfer(content_tensor, style_tensor)
        
        # Store result in database
        result_data = {
            "filename": f"result_{session_id}.png",
            "content_type": "image/png",
            "data": result_bytes,
            "type": "result",
            "size": len(result_bytes),
            "session_id": session_id,
            "created_at": datetime.utcnow()
        }
        result = collection.insert_one(result_data)
        
        return {
            "message": "Style transfer completed",
            "session_id": session_id,
            "result_id": str(result.inserted_id)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@app.get("/result/{session_id}")
async def get_result(session_id: str):
    """Fetch the processed result image"""
    try:
        result = collection.find_one({"session_id": session_id, "type": "result"})
        
        if not result:
            raise HTTPException(status_code=404, detail="Result not found")
        
        image_base64 = base64.b64encode(result["data"]).decode("utf-8")
        
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


@app.get("/status/{session_id}")
async def check_status(session_id: str):
    """Check if result is ready"""
    result = collection.find_one({"session_id": session_id, "type": "result"})
    return {
        "session_id": session_id,
        "ready": result is not None
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)