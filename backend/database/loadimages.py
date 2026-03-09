from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, PyMongoError
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME")

if not mongo_url or not db_name:
    raise ValueError("Missing MONGO_URL or DB_NAME in environment variables")

def get_collection():
    """Get database collection with connection handling"""
    try:
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')  # Test connection
        db = client[db_name]
        return db["images"]
    except ConnectionFailure as e:
        print(f"MongoDB connection failed: {e}")
        raise


def get_style_image(session_id: str):
    """
    Fetch style image by session_id
    """
    try:
        collection = get_collection()
        image = collection.find_one({"session_id": session_id, "type": "style"})
        
        if image:
            return {
                "id": str(image["_id"]),
                "filename": image.get("filename"),
                "content_type": image.get("content_type"),
                "type": image.get("type"),
                "size": image.get("size", 0),
                "session_id": image.get("session_id"),
                "uploaded_at": image.get("uploaded_at"),
                "data": image.get("data")
            }
        return None
    except PyMongoError as e:
        print(f"Error fetching style image: {e}")
        return None


def get_content_image(session_id: str):
    """
    Fetch content image by session_id
    """
    try:
        collection = get_collection()
        image = collection.find_one({"session_id": session_id, "type": "content"})
        
        if image:
            return {
                "id": str(image["_id"]),
                "filename": image.get("filename"),
                "content_type": image.get("content_type"),
                "type": image.get("type"),
                "size": image.get("size", 0),
                "session_id": image.get("session_id"),
                "uploaded_at": image.get("uploaded_at"),
                "data": image.get("data")
            }
        return None
    except PyMongoError as e:
        print(f"Error fetching content image: {e}")
        return None


def get_images_by_session(session_id: str):
    """
    Fetch both style and content images by session_id
    """
    return {
        "style": get_style_image(session_id),
        "content": get_content_image(session_id)
    }