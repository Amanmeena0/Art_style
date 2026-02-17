import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import PIL.Image
from io import BytesIO
import uuid
from datetime import datetime
from database import MongoDBConnection
import base64

app = FastAPI(title="Art Style Transfer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

hub_model = None

@app.on_event("startup")
async def load_model():
    global hub_model
    hub_model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')

db = MongoDBConnection()


def load_image_from_upload(file_content: bytes, max_dim: int = 512) -> tf.Tensor:
    img = tf.image.decode_image(file_content, channels=3)
    img = tf.cast(img, tf.float32)
    shape = tf.cast(tf.shape(img)[:-1], tf.float32)
    long_dim = max(shape)
    scale = max_dim / long_dim
    new_shape = tf.cast(shape * scale, tf.int32)
    img = tf.image.resize(img, new_shape)
    img = img / 255.0
    img = img[tf.newaxis, :]
    return img


def tensor_to_image(tensor: tf.Tensor) -> PIL.Image.Image:
    tensor = tensor * 255
    tensor = np.array(tensor, dtype=np.uint8)
    if np.ndim(tensor) > 3:
        tensor = tensor[0]
    return PIL.Image.fromarray(tensor)


def image_to_base64(image: PIL.Image.Image) -> str:
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode()


@app.get("/")
async def root():
    return {"message": "Art Style Transfer API", "status": "healthy"}


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": hub_model is not None,
        "database_connected": db.is_connected()
    }


@app.post("/transfer")
async def style_transfer(
    content_image: UploadFile = File(...),
    style_image: UploadFile = File(...)
):
    try:
        allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
        if content_image.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid content image type")
        if style_image.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid style image type")
        
        content_bytes = await content_image.read()
        style_bytes = await style_image.read()
        
        content_tensor = load_image_from_upload(content_bytes)
        style_tensor = load_image_from_upload(style_bytes)
        
        stylized_tensor = hub_model(tf.constant(content_tensor), tf.constant(style_tensor))[0]
        result_image = tensor_to_image(stylized_tensor)
        
        result_id = str(uuid.uuid4())
        result_filename = f"{result_id}.png"
        result_path = os.path.join(os.path.dirname(__file__), '..', 'images', 'results', result_filename)
        result_image.save(result_path)
        
        result_base64 = image_to_base64(result_image)
        
        record = {
            "result_id": result_id,
            "content_filename": content_image.filename,
            "style_filename": style_image.filename,
            "result_filename": result_filename,
            "result_path": result_path,
            "created_at": datetime.utcnow(),
            "status": "completed"
        }
        db.save_transfer_record(record)
        
        return JSONResponse(content={
            "success": True,
            "result_id": result_id,
            "result_image": result_base64,
            "message": "Style transfer completed"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/result/{result_id}")
async def get_result(result_id: str):
    result_path = os.path.join(os.path.dirname(__file__), '..', 'images', 'results', f"{result_id}.png")
    if not os.path.exists(result_path):
        raise HTTPException(status_code=404, detail="Result not found")
    return FileResponse(result_path, media_type="image/png")


@app.get("/history")
async def get_history(limit: int = 10):
    try:
        records = db.get_transfer_history(limit)
        return {"success": True, "records": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/result/{result_id}")
async def delete_result(result_id: str):
    try:
        result_path = os.path.join(os.path.dirname(__file__), '..', 'images', 'results', f"{result_id}.png")
        if os.path.exists(result_path):
            os.remove(result_path)
        db.delete_transfer_record(result_id)
        return {"success": True, "message": "Deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
