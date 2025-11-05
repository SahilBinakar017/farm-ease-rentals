import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

np.random.seed(42)

# Machine types and their typical base rates
machine_types = {
    "Tractor": 2000,
    "Harvester": 4000,
    "Plough": 1500,
    "Drone": 4500,
}

seasons = ["Planting", "Growing", "Harvest", "Off-Season"]
booking_times = ["Morning", "Afternoon", "Evening", "Night"]

data = []

for i in range(1000):
    machine_type = random.choice(list(machine_types.keys()))
    base_rate = machine_types[machine_type] * np.random.uniform(0.9, 1.1)
    season = random.choice(seasons)
    booking_time = random.choice(booking_times)

    # Booking time
    start_hour = {
        "Morning": random.randint(6, 10),
        "Afternoon": random.randint(11, 15),
        "Evening": random.randint(16, 19),
        "Night": random.randint(20, 21),
    }[booking_time]

    start = datetime(2025, random.randint(1, 12), random.randint(1, 28), start_hour)
    duration_hours = np.random.randint(2, 6)  # rentals between 2 to 6 hours
    end = start + timedelta(hours=duration_hours)

    # Other numerical factors
    discount = np.random.uniform(0, 15)  
    gst = 18.0  # fixed
    demand_index = np.random.uniform(0.5, 1.5)
    availability = np.random.choice([True, False], p=[0.9, 0.1])

    # Seasonal multiplier 
    season_multiplier = {
        "Planting": 1.1,
        "Growing": 1.0,
        "Harvest": 1.3,
        "Off-Season": 0.8
    }[season]

    # Time-of-day multiplier 
    time_multiplier = {
        "Morning": 1.2,
        "Afternoon": 1.0,
        "Evening": 1.15,
        "Night": 0.9
    }[booking_time]

    # Price formula
    final_price = (
        base_rate * (duration_hours / 8) * season_multiplier * time_multiplier * demand_index
    )
    final_price = final_price * (1 - discount / 100)
    final_price = final_price * (1 + gst / 100)

    data.append({
        "machine_type": machine_type,
        "baseRate": round(base_rate, 2),
        "season": season,
        "booking_time": booking_time,
        "duration_hours": duration_hours,
        "discount": round(discount, 2),
        "gst": gst,
        "demand_index": round(demand_index, 2),
        "available": availability,
        "finalPrice": round(final_price, 2)
    })

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv("synthetic_farm_rentals.csv", index=False)

print(df.head(10))
print(f"\nGenerated {len(df)} synthetic booking records.")
