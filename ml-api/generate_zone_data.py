import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["muhafizDB"]
incident_collection = db["incidents"]

df = pd.read_csv("karachi_crime_dataset.csv")

synthetic_zones = df[["SUBDIVISION", "TOWN", "LATITUDE", "LONGITUDE", "RISK_ZONE"]].drop_duplicates()
synthetic_zones.columns = ["subdivision", "town", "lat", "lng", "zone"]
synthetic_zones["source"] = "synthetic"

mongo_data = []
for doc in incident_collection.find({}):
    try:
        if "location" in doc:
            if isinstance(doc["location"], str):
                lat_str, lng_str = doc["location"].split(",")
                lat = float(lat_str.strip())
                lng = float(lng_str.strip())
            else:
                lat = doc["location"]["lat"]
                lng = doc["location"]["lng"]
        else:
            lat = doc.get("lat", 0)
            lng = doc.get("lng", 0)
        
        mongo_data.append({
            "subdivision": doc.get("subdivision", "Unknown"),
            "town": doc.get("town", "Unknown"),
            "lat": lat,
            "lng": lng,
            "zone": doc.get("zone", "Unknown"),
            "source": "user"
        })
    except Exception as e:
        print(f"Skipping malformed document: {e}")
        continue

mongo_df = pd.DataFrame(mongo_data)
final_df = pd.concat([synthetic_zones, mongo_df], ignore_index=True)
final_df.to_csv("zone_data.csv", index=False)
print("zone_data.csv created with", len(final_df), "records.")