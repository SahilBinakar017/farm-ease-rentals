from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

# Load the trained model
model = joblib.load("price_model.pkl")

# Initialize FastAPI app
app = FastAPI()

# Allow frontend/backend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input data format
class PredictionInput(BaseModel):
    machineType: str
    baseRate: float
    hours: float
    season: str | None = "Harvest"
    booking_time: str | None = "Morning"
    discount: float | None = 0
    gst: float | None = 18
    demand_index: float | None = 1.0
    available: bool | None = True

@app.post("/predict")
def predict_price(input_data: PredictionInput):
    # Convert to DataFrame (model expects same columns)
    df = pd.DataFrame([{
        "machine_type": input_data.machineType,
        "baseRate": input_data.baseRate,
        "season": input_data.season,
        "booking_time": input_data.booking_time,
        "duration_hours": input_data.hours,
        "discount": input_data.discount,
        "gst": input_data.gst,
        "demand_index": input_data.demand_index,
        "available": input_data.available
    }])

    # Make prediction
    predicted_price = model.predict(df)[0]

    return {"predictedPrice": round(float(predicted_price), 2)}
