from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from safe_route import find_safest_path

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB client
client = MongoClient(MONGO_URI)
db = client["muhafizDB"]
incident_collection = db["incidents"]

# Load synthetic dataset once on startup
crime_df = pd.read_csv("karachi_crime_dataset.csv")

# Clean and reduce to necessary zone data
zone_df = crime_df[[
    'SUBDIVISION', 'TOWN', 'LATITUDE', 'LONGITUDE', 'RISK_ZONE'
]].drop_duplicates()

@app.route('/get-zone-data', methods=['GET'])
def get_zone_data():
    zone_filter = request.args.get('zone')
    town_filter = request.args.get('town')

    filtered_df = zone_df.copy()

    if zone_filter:
        filtered_df = filtered_df[filtered_df['RISK_ZONE'].str.upper() == zone_filter.upper()]
    if town_filter:
        filtered_df = filtered_df[filtered_df['TOWN'].str.lower() == town_filter.lower()]

    zone_list = []

    # Add from synthetic data
    for _, row in filtered_df.iterrows():
        zone_list.append({
            "subdivision": row["SUBDIVISION"],
            "town": row["TOWN"],
            "lat": row["LATITUDE"],
            "lng": row["LONGITUDE"],
            "zone": row["RISK_ZONE"],
            "source": "synthetic"
        })

    # Add from user-reported MongoDB incidents
    mongo_filter = {}
    if zone_filter:
        mongo_filter["zone"] = zone_filter.upper()
    if town_filter:
        mongo_filter["town"] = town_filter

    incidents = incident_collection.find(mongo_filter)

    for doc in incidents:
        try:
            # Handle both string and embedded location formats
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
                
            zone_list.append({
                "subdivision": doc.get("subdivision", "Unknown"),
                "town": doc.get("town", "Unknown"),
                "lat": lat,
                "lng": lng,
                "zone": doc.get("zone", "Unknown"),
                "source": "user"
            })
        except (ValueError, KeyError):
            continue

    return jsonify({ "zones": zone_list })

@app.route("/safe-route", methods=["POST"])
def get_safe_route():
    data = request.json
    start = data.get("start")
    end = data.get("end")

    if not start or not end:
        return jsonify({"error": "Missing input"}), 400

    result = find_safest_path(start, end)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5001, debug=True)