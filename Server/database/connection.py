from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv


load_dotenv()

mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(mongo_url)
db = client[db_name]
collection = db["images"]


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()

    image_data = {
        "filename":file.filename,
        "content_type":file.content_type,
        "data":contents
    }

    collection.insert_one(image_data)

    return {"message": "Image uploaded successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
