from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from gridfs import GridFS
import os
from dotenv import load_dotenv
import logging
from bson import ObjectId
import base64

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME")

if not mongo_url or not db_name:
    logger.error("Missing MONGO_URL or DB_NAME in environment variables")
    raise ValueError("Missing required environment variables")

app = FastAPI()

# Configure CORS more specifically
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Your React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    client = MongoClient(mongo_url)
    db = client[db_name]
    # Test connection
    client.admin.command('ping')
    logger.info("✅ Connected to MongoDB successfully")
    
    # Use GridFS for large files
    fs = GridFS(db)
    collection = db["images"]
except Exception as e:
    logger.error(f"❌ Failed to connect to MongoDB: {e}")
    raise

@app.get("/")
async def root():
    return {"message": "FastAPI server is running"}

@app.post("/upload")
async def upload_image(photo1: UploadFile = File(...), photo2: UploadFile = File(...)):
    logger.info(f"📥 Received upload request from frontend")
    logger.info(f"   - Photo1: {photo1.filename}, Size: {photo1.size if hasattr(photo1, 'size') else 'unknown'}")
    logger.info(f"   - Photo2: {photo2.filename}, Size: {photo2.size if hasattr(photo2, 'size') else 'unknown'}")
    
    try:
        # Process photo1
        contents1 = await photo1.read()
        logger.info(f"   - Photo1 size: {len(contents1)} bytes")
        
        # Store in MongoDB
        image_data1 = {
            "filename": photo1.filename,
            "content_type": photo1.content_type,
            "data": contents1,
            "type": "photo1",
            "size": len(contents1)
        }
        result1 = collection.insert_one(image_data1)
        logger.info(f"   ✓ Photo1 stored with ID: {result1.inserted_id}")
        
        # Process photo2
        contents2 = await photo2.read()
        logger.info(f"   - Photo2 size: {len(contents2)} bytes")
        
        image_data2 = {
            "filename": photo2.filename,
            "content_type": photo2.content_type,
            "data": contents2,
            "type": "photo2",
            "size": len(contents2)
        }
        result2 = collection.insert_one(image_data2)
        logger.info(f"   ✓ Photo2 stored with ID: {result2.inserted_id}")
        
        logger.info(f"✅ Both images uploaded successfully")
        
        return {
            "message": "Both images uploaded successfully", 
            "photo1": {
                "filename": photo1.filename,
                "size": len(contents1),
                "id": str(result1.inserted_id)
            },
            "photo2": {
                "filename": photo2.filename,
                "size": len(contents2),
                "id": str(result2.inserted_id)
            }
        }
    
    except Exception as e:
        logger.error(f"❌ Error uploading images: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/images")
async def get_images(limit: int = 10, image_type: str = None):
    """
    Retrieve multiple images from the database
    - limit: maximum number of images to return (default: 10)
    - image_type: filter by image type (photo1, photo2, or None for all)
    """
    try:
        logger.info(f"📤 Fetching images from database (limit: {limit}, type: {image_type})")
        
        # Build query
        query = {}
        if image_type:
            query["type"] = image_type
        
        # Fetch images from database
        images = collection.find(query).sort("_id", -1).limit(limit)
        
        result = []
        for image in images:
            result.append({
                "id": str(image["_id"]),
                "filename": image["filename"],
                "content_type": image["content_type"],
                "type": image.get("type", "unknown"),
                "size": image.get("size", 0),
                "data": base64.b64encode(image["data"]).decode('utf-8')
            })
        
        logger.info(f"✅ Retrieved {len(result)} images")
        return {
            "count": len(result),
            "images": result
        }
    
    except Exception as e:
        logger.error(f"❌ Error retrieving images: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve images: {str(e)}")

@app.get("/images/{image_id}")
async def get_image(image_id: str):
    """
    Retrieve a single image by its ID
    """
    try:
        logger.info(f"📤 Fetching image with ID: {image_id}")
        image = collection.find_one({"_id": ObjectId(image_id)})
        
        if image:
            logger.info(f"✅ Image found: {image['filename']}")
            # Return image data as base64
            return {
                "id": str(image["_id"]),
                "filename": image["filename"],
                "content_type": image["content_type"],
                "type": image.get("type", "unknown"),
                "size": image.get("size", 0),
                "data": base64.b64encode(image["data"]).decode('utf-8')
            }
        
        logger.warning(f"⚠️ Image not found with ID: {image_id}")
        raise HTTPException(status_code=404, detail="Image not found")
    
    except Exception as e:
        logger.error(f"❌ Error retrieving image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting FastAPI server on http://127.0.0.1:8000")
    logger.info("📡 Listening for frontend requests...")
    logger.info("🌐 CORS enabled for http://localhost:3000")
    uvicorn.run(app, host="127.0.0.1", port=8000)  # removed reload=True