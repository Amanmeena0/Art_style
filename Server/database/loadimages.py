from pymongo import MongoClient
import os
from dotenv import load_dotenv
import base64

load_dotenv()

mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME")

if not mongo_url or not db_name:
    raise ValueError("Missing MONGO_URL or DB_NAME in environment variables")

client = MongoClient(mongo_url)
db = client[db_name]
collection = db["images"]


def get_style_image(session_id: str):
    """
    Fetch style image by session_id
    """
    image = collection.find_one({"session_id": session_id, "type": "style"})
    
    if image:
        return {
            "id": str(image["_id"]),
            "filename": image["filename"],
            "content_type": image["content_type"],
            "type": image.get("type"),
            "size": image.get("size", 0),
            "session_id": image.get("session_id"),
            "uploaded_at": image.get("uploaded_at"),
            "data": image["data"]  # Return raw binary data
        }
    return None


def get_content_image(session_id: str):
    """
    Fetch content image by session_id
    """
    image = collection.find_one({"session_id": session_id, "type": "content"})
    
    if image:
        return {
            "id": str(image["_id"]),
            "filename": image["filename"],
            "content_type": image["content_type"],
            "type": image.get("type"),
            "size": image.get("size", 0),
            "session_id": image.get("session_id"),
            "uploaded_at": image.get("uploaded_at"),
            "data": image["data"]  # Return raw binary data
        }
    return None


def get_images_by_session(session_id: str):
    """
    Fetch both style and content images by session_id
    """
    return {
        "style": get_style_image(session_id),
        "content": get_content_image(session_id)
    }