import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# Load the dataset
df = pd.read_csv("synthetic_farm_rentals.csv")
print("✅ Data loaded successfully!")
print(df.head())

# Define features and target
X = df[[
    "machine_type",
    "season",
    "booking_time",
    "baseRate",
    "duration_hours",
    "discount",
    "gst",
    "demand_index",
    "available"
]]
y = df["finalPrice"]

# Preprocess categorical features
categorical_features = ["machine_type", "season", "booking_time"]
numeric_features = ["baseRate", "duration_hours", "discount", "gst", "demand_index", "available"]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ],
    remainder="passthrough"  # keep numeric features as is
)

# Create a pipeline (preprocessing + model)
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", LinearRegression())
])

# Split the data into train/test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model.fit(X_train, y_train)
print("Model training complete!")

# Evaluate
r2_score = model.score(X_test, y_test)
print(f"Model R² Score: {r2_score:.3f}")

# Save the model to a file
joblib.dump(model, "price_model.pkl")
print("Model saved as 'price_model.pkl'")

# Try a sample prediction
sample = pd.DataFrame([{
    "machine_type": "Tractor",
    "season": "Harvest",
    "booking_time": "Morning",
    "baseRate": 2000,
    "duration_hours": 5,
    "discount": 5,
    "gst": 18,
    "demand_index": 1.2,
    "available": True
}])

predicted_price = model.predict(sample)[0]
print(f"Predicted price for sample booking: ₹{predicted_price:.2f}")
