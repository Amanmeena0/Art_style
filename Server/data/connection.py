from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class InputData(BaseModel):
    text: str # or image_url if you're doing CV

@app.post("/predict")
async def predict(data: InputData):
    # This is where your ML model lives
    # prediction = model.predict(data.text)
    result = f"Model processed: {data.text}" 
    return {"prediction": result}