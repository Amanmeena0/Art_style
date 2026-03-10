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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)