# import json
# import pandas as pd
# import networkx as nx
# from geopy.distance import geodesic
# from pymongo import MongoClient
# import os
# import math
# import time
# from collections import defaultdict
# from dotenv import load_dotenv
# load_dotenv()

# # MongoDB connection
# MONGO_URI = os.getenv("MONGO_URI")
# client = MongoClient(MONGO_URI)
# incident_collection = client["muhafizDB"]["incidents"]

# # Load road graph from file
# with open("road_graph.json") as f:
#     graph_data = json.load(f)

# # Convert JSON to NetworkX graph
# G = nx.node_link_graph(graph_data)
# G = G.to_undirected()

# # Define how risky each zone type is
# ZONE_WEIGHTS = {
#     "RED": 1000,
#     "ORANGE": 500,
#     "YELLOW": 100,
#     "GREEN": 0,
# }

# # Cache zone data and risk grid
# last_zone_update = 0
# zone_cache = None
# risk_grid = None
# GRID_SIZE = 0.005  # ~500m grid cells
# CACHE_DURATION = 300  # 5 minutes

# def haversine(lat1, lon1, lat2, lon2):
#     R = 6371000  # Earth radius in meters
#     phi1 = math.radians(lat1)
#     phi2 = math.radians(lat2)
#     delta_phi = math.radians(lat2 - lat1)
#     delta_lambda = math.radians(lon2 - lon1)
    
#     a = (math.sin(delta_phi/2)**2 + 
#          math.cos(phi1) * math.cos(phi2) *
#          math.sin(delta_lambda/2)**2)
    
#     return R * (2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))

# def get_zone_data():
#     global last_zone_update, zone_cache
    
#     # Return cached data if not expired
#     if zone_cache is not None and time.time() - last_zone_update < CACHE_DURATION:
#         return zone_cache
    
#     # Load synthetic data
#     df = pd.read_csv("karachi_crime_dataset.csv")
#     syn = df[['SUBDIVISION', 'TOWN', 'LATITUDE', 'LONGITUDE', 'RISK_ZONE']]
#     syn.columns = ['subdivision', 'town', 'lat', 'lng', 'zone']
    
#     # Load MongoDB data
#     mongo_zones = []
#     for doc in incident_collection.find({"location": {"$exists": True}}):
#         try:
#             if isinstance(doc["location"], str):
#                 lat_str, lng_str = doc["location"].split(",")
#                 lat = float(lat_str.strip())
#                 lng = float(lng_str.strip())
#             else:
#                 lat = doc["location"]["lat"]
#                 lng = doc["location"]["lng"]
                
#             mongo_zones.append({
#                 "subdivision": doc.get("subdivision", "Unknown"),
#                 "town": doc.get("town", "Unknown"),
#                 "lat": lat,
#                 "lng": lng,
#                 "zone": doc.get("zone", "Unknown"),
#             })
#         except Exception:
#             continue

#     mongo_df = pd.DataFrame(mongo_zones)
#     zone_data = pd.concat([syn, mongo_df], ignore_index=True)
#     zone_data = zone_data.drop_duplicates()
    
#     # Cache results
#     zone_cache = zone_data
#     last_zone_update = time.time()
#     return zone_data

# def build_risk_grid(zone_df):
#     grid = defaultdict(float)
    
#     for _, row in zone_df.iterrows():
#         weight = ZONE_WEIGHTS.get(row['zone'].upper(), 0)
#         if weight == 0:
#             continue
            
#         lat, lng = row['lat'], row['lng']
#         grid_i = int(lat / GRID_SIZE)
#         grid_j = int(lng / GRID_SIZE)
        
#         # Add risk to the 3x3 grid cells around the point
#         for i_offset in (-1, 0, 1):
#             for j_offset in (-1, 0, 1):
#                 cell_key = (grid_i + i_offset, grid_j + j_offset)
#                 grid[cell_key] += weight * 0.7  # Weight decreases with distance
                
#     return grid

# def get_zone_penalty(lat, lng):
#     global risk_grid
#     if risk_grid is None:
#         return 0
        
#     grid_i = int(lat / GRID_SIZE)
#     grid_j = int(lng / GRID_SIZE)
#     return risk_grid.get((grid_i, grid_j), 0)

# def apply_zone_weights():
#     global G
#     for u, v, data in G.edges(data=True):
#         u_coords = (G.nodes[u]['y'], G.nodes[u]['x'])
#         v_coords = (G.nodes[v]['y'], G.nodes[v]['x'])
        
#         # Calculate base distance
#         base_distance = geodesic(u_coords, v_coords).meters
        
#         # Calculate penalty from risk grid
#         midpoint = (
#             (u_coords[0] + v_coords[0]) / 2,
#             (u_coords[1] + v_coords[1]) / 2
#         )
#         penalty = get_zone_penalty(midpoint[0], midpoint[1])
        
#         data['weight'] = base_distance + penalty

# def nearest_node(point):
#     global G
#     lat, lon = point['lat'], point['lng']
#     return min(G.nodes, key=lambda n: 
#                (G.nodes[n]['y'] - lat)**2 + 
#                (G.nodes[n]['x'] - lon)**2)

# # Initialize the system at startup
# def initialize_system():
#     global zone_cache, risk_grid
#     zone_data = get_zone_data()
#     risk_grid = build_risk_grid(zone_data)
#     apply_zone_weights()

# # Initialize the system
# initialize_system()

# def calculate_safety_score(zone_summary):
#     red = zone_summary.get("RED", 0)
#     orange = zone_summary.get("ORANGE", 0)
#     yellow = zone_summary.get("YELLOW", 0)
#     green = zone_summary.get("GREEN", 0)

#     total = red + orange + yellow + green
#     if total == 0:
#         return 100

#     risk_points = red * 10 + orange * 5 + yellow * 2
#     max_risk = total * 10

#     return round(100 - (risk_points / max_risk) * 100)

# def summarize_route(route_coords, zone_data):
#     zone_summary = {"RED": 0, "ORANGE": 0, "YELLOW": 0, "GREEN": 0}

#     for coord in route_coords:
#         for _, row in zone_data.iterrows():
#             if haversine(row['lat'], row['lng'], coord[0], coord[1]) <= 300:
#                 zone_type = row['zone'].upper()
#                 if zone_type in zone_summary:
#                     zone_summary[zone_type] += 1
#                 break

#     red_bypassed = sum(
#         1 for _, row in zone_data.iterrows()
#         if row["zone"].upper() == "RED"
#         and not any(haversine(row["lat"], row["lng"], c[0], c[1]) < 300 for c in route_coords)
#     )

#     return zone_summary, red_bypassed

# def compute_route(start, end, graph, zone_data):
#     start_node = nearest_node(start)
#     end_node = nearest_node(end)
#     path = nx.shortest_path(graph, source=start_node, target=end_node, weight="weight")
#     route_coords = [[graph.nodes[n]['y'], graph.nodes[n]['x']] for n in path]

#     total_distance = 0
#     for i in range(len(route_coords) - 1):
#         total_distance += geodesic(route_coords[i], route_coords[i + 1]).km

#     zone_summary, red_bypassed = summarize_route(route_coords, zone_data)
#     safety_score = calculate_safety_score(zone_summary)

#     extra_features = {
#         "safe_havens": 5,
#         "light_status": "Well-lit until 2AM",
#         "crowd_status": "High foot traffic",
#         "surveillance": True,
#     }

#     return {
#         "route": route_coords,
#         "distance_km": round(total_distance, 2),
#         "zone_summary": zone_summary,
#         "safety_score": safety_score,
#         "red_zones_bypassed": red_bypassed,
#         "extra": extra_features
#     }

# def build_custom_graph(base_graph, penalty_function):
#     new_graph = base_graph.copy()
#     for u, v, data in new_graph.edges(data=True):
#         u_coords = (new_graph.nodes[u]['y'], new_graph.nodes[u]['x'])
#         v_coords = (new_graph.nodes[v]['y'], new_graph.nodes[v]['x'])
#         base_distance = geodesic(u_coords, v_coords).meters
#         midpoint = (
#             (u_coords[0] + v_coords[0]) / 2,
#             (u_coords[1] + v_coords[1]) / 2
#         )
#         penalty = penalty_function(midpoint[0], midpoint[1])
#         data['weight'] = base_distance + penalty
#     return new_graph

# def find_safest_path(start, end):
#     global last_zone_update, risk_grid, G

#     try:
#         if time.time() - last_zone_update > CACHE_DURATION:
#             zone_data = get_zone_data()
#             risk_grid = build_risk_grid(zone_data)
#             apply_zone_weights()
#         else:
#             zone_data = zone_cache

#         # Safest: full zone weights
#         safest_graph = build_custom_graph(G, get_zone_penalty)

#         # Fastest: avoid RED only
#         def penalty_fastest(lat, lng):
#             grid_i = int(lat / GRID_SIZE)
#             grid_j = int(lng / GRID_SIZE)
#             key = (grid_i, grid_j)
#             return risk_grid.get(key, 0) if risk_grid.get(key, 0) >= 1000 else 0

#         # Balanced: penalize red + some orange/yellow
#         def penalty_balanced(lat, lng):
#             grid_i = int(lat / GRID_SIZE)
#             grid_j = int(lng / GRID_SIZE)
#             penalty = risk_grid.get((grid_i, grid_j), 0)
#             if penalty >= 1000:  # RED
#                 return 800
#             elif penalty >= 500:  # ORANGE
#                 return 200
#             elif penalty >= 100:  # YELLOW
#                 return 100
#             return 0

#         fastest_graph = build_custom_graph(G, penalty_fastest)
#         balanced_graph = build_custom_graph(G, penalty_balanced)

#         safest = compute_route(start, end, safest_graph, zone_data)
#         fastest = compute_route(start, end, fastest_graph, zone_data)
#         balanced = compute_route(start, end, balanced_graph, zone_data)

#         return {
#             "success": True,
#             "safest": safest,
#             "fastest": fastest,
#             "balanced": balanced
#         }

#     except Exception as e:
#         return {"success": False, "error": str(e)}


import json
import pandas as pd
import networkx as nx
from geopy.distance import geodesic
from pymongo import MongoClient
import os
import math
import time
from collections import defaultdict
from dotenv import load_dotenv
import numpy as np
from sklearn.neighbors import BallTree

load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
incident_collection = client["muhafizDB"]["incidents"]

# Load road graph from file
with open("road_graph.json") as f:
    graph_data = json.load(f)

# Convert JSON to NetworkX graph
G = nx.node_link_graph(graph_data)
G = G.to_undirected()

# Define how risky each zone type is
ZONE_WEIGHTS = {
    "RED": 1000,
    "ORANGE": 500,
    "YELLOW": 100,
    "GREEN": 0,
}

# Cache system
last_zone_update = 0
zone_cache = None
risk_grid = None
zone_tree = None
zone_points_rad = None
edge_weight_cache = {}
GRID_SIZE = 0.005
CACHE_DURATION = 300
CACHE_MAX_SIZE = 10000

def haversine(lat1, lon1, lat2, lon2):
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    return 6371000 * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))  # Meters

def get_zone_data():
    global last_zone_update, zone_cache
    
    if zone_cache is not None and time.time() - last_zone_update < CACHE_DURATION:
        return zone_cache
    
    # Load synthetic data
    df = pd.read_csv("karachi_crime_dataset.csv")
    syn = df[['SUBDIVISION', 'TOWN', 'LATITUDE', 'LONGITUDE', 'RISK_ZONE']]
    syn.columns = ['subdivision', 'town', 'lat', 'lng', 'zone']
    
    # Load MongoDB data
    mongo_zones = []
    for doc in incident_collection.find({"location": {"$exists": True}}):
        try:
            if isinstance(doc["location"], str):
                lat_str, lng_str = doc["location"].split(",")
                lat = float(lat_str.strip())
                lng = float(lng_str.strip())
            else:
                lat = doc["location"]["lat"]
                lng = doc["location"]["lng"]
                
            mongo_zones.append({
                "subdivision": doc.get("subdivision", "Unknown"),
                "town": doc.get("town", "Unknown"),
                "lat": lat,
                "lng": lng,
                "zone": doc.get("zone", "Unknown"),
            })
        except Exception:
            continue

    mongo_df = pd.DataFrame(mongo_zones)
    zone_data = pd.concat([syn, mongo_df], ignore_index=True)
    zone_data = zone_data.drop_duplicates()
    
    zone_cache = zone_data
    last_zone_update = time.time()
    return zone_data

def build_risk_grid(zone_df):
    grid = defaultdict(float)
    
    for _, row in zone_df.iterrows():
        weight = ZONE_WEIGHTS.get(row['zone'].upper(), 0)
        if weight == 0:
            continue
            
        lat, lng = row['lat'], row['lng']
        grid_i = int(lat / GRID_SIZE)
        grid_j = int(lng / GRID_SIZE)
        
        for i_offset in (-1, 0, 1):
            for j_offset in (-1, 0, 1):
                cell_key = (grid_i + i_offset, grid_j + j_offset)
                grid[cell_key] += weight * 0.7
                
    return grid

def build_spatial_index(zone_data):
    global zone_tree, zone_points_rad
    points = zone_data[['lat', 'lng']].values
    zone_points_rad = np.radians(points)
    zone_tree = BallTree(zone_points_rad, metric='haversine')
    return zone_points_rad

def find_nearby_zones(point, radius=0.3):
    global zone_tree
    if zone_tree is None:
        return []
        
    point_rad = np.radians(np.array([point]))
    radius_rad = radius / 6371  # Convert km to radians
    return zone_tree.query_radius(point_rad, r=radius_rad)[0]

def get_zone_penalty(lat, lng):
    global risk_grid
    if risk_grid is None:
        return 0
        
    grid_i = int(lat / GRID_SIZE)
    grid_j = int(lng / GRID_SIZE)
    return risk_grid.get((grid_i, grid_j), 0)

def nearest_node(point):
    lat, lon = point['lat'], point['lng']
    return min(G.nodes, key=lambda n: 
               (G.nodes[n]['y'] - lat)**2 + 
               (G.nodes[n]['x'] - lon)**2)

def initialize_system():
    global risk_grid, zone_tree
    zone_data = get_zone_data()
    risk_grid = build_risk_grid(zone_data)
    build_spatial_index(zone_data)
    return zone_data

# Initialize system
zone_data = initialize_system()

def calculate_safety_score(zone_summary):
    red = zone_summary.get("RED", 0)
    orange = zone_summary.get("ORANGE", 0)
    yellow = zone_summary.get("YELLOW", 0)
    green = zone_summary.get("GREEN", 0)

    total = red + orange + yellow + green
    if total == 0:
        return 100

    risk_points = red * 10 + orange * 5 + yellow * 2
    max_risk = total * 10

    return max(0, min(100, round(100 - (risk_points / max_risk) * 100)))

def summarize_route(route_coords):
    if not route_coords or zone_tree is None:
        return {"RED": 0, "ORANGE": 0, "YELLOW": 0, "GREEN": 0}, 0

    zone_summary = defaultdict(int)
    counted_zones = set()
    
    # Get all nearby zones along the route
    for coord in route_coords:
        indices = find_nearby_zones(coord)
        for idx in indices:
            if idx in counted_zones:
                continue
                
            row = zone_cache.iloc[idx]
            zone_type = row['zone'].upper()
            if zone_type in ZONE_WEIGHTS:
                zone_summary[zone_type] += 1
                counted_zones.add(idx)

    # Count red zones bypassed
    all_red_indices = set(zone_cache.index[zone_cache['zone'].str.upper() == 'RED'])
    red_bypassed = len(all_red_indices - counted_zones)

    return dict(zone_summary), red_bypassed

def get_edge_weight(u, v, penalty_function):
    cache_key = (u, v, id(penalty_function))
    
    # Manage cache size
    if len(edge_weight_cache) > CACHE_MAX_SIZE:
        edge_weight_cache.clear()
    
    if cache_key in edge_weight_cache:
        return edge_weight_cache[cache_key]
    
    u_coords = (G.nodes[u]['y'], G.nodes[u]['x'])
    v_coords = (G.nodes[v]['y'], G.nodes[v]['x'])
    base_distance = haversine(u_coords[0], u_coords[1], v_coords[0], v_coords[1])
    midpoint = ((u_coords[0] + v_coords[0])/2, (u_coords[1] + v_coords[1])/2)
    penalty = penalty_function(midpoint[0], midpoint[1])
    
    weight = base_distance + penalty
    edge_weight_cache[cache_key] = weight
    return weight

def compute_route(start, end, penalty_function):
    try:
        start_node = nearest_node(start)
        end_node = nearest_node(end)
        
        def weight_func(u, v, data):
            return get_edge_weight(u, v, penalty_function)
        
        path = nx.shortest_path(G, source=start_node, target=end_node, weight=weight_func)
        route_coords = [[G.nodes[n]['y'], G.nodes[n]['x']] for n in path]

        # Calculate total distance
        total_distance = 0
        for i in range(len(route_coords) - 1):
            total_distance += geodesic(route_coords[i], route_coords[i+1]).km

        zone_summary, red_bypassed = summarize_route(route_coords)
        safety_score = calculate_safety_score(zone_summary)

        return {
            "route": route_coords,
            "distance_km": round(total_distance, 2),
            "zone_summary": zone_summary,
            "safety_score": safety_score,
            "red_zones_bypassed": red_bypassed,
            "waypoints": len(route_coords)
        }

    except nx.NetworkXNoPath:
        return {"error": "No path found"}
    except Exception as e:
        return {"error": str(e)}

def find_safest_path(start, end):
    global last_zone_update, risk_grid, zone_data
    
    try:
        # Refresh data if cache expired
        if time.time() - last_zone_update > CACHE_DURATION:
            zone_data = get_zone_data()
            risk_grid = build_risk_grid(zone_data)
            build_spatial_index(zone_data)
        
        # Define route strategies
        strategies = {
            "safest": get_zone_penalty,
            "fastest": lambda lat, lng: 1000 if get_zone_penalty(lat, lng) >= 1000 else 0,
            "balanced": lambda lat, lng: min(get_zone_penalty(lat, lng), 800)
        }
        
        results = {}
        for name, penalty_func in strategies.items():
            route_result = compute_route(start, end, penalty_func)
            if "error" in route_result:
                return {"success": False, "error": f"{name} route: {route_result['error']}"}
            results[name] = route_result

        return {
            "success": True,
            "safest": results["safest"],
            "fastest": results["fastest"],
            "balanced": results["balanced"]
        }

    except Exception as e:
        return {"success": False, "error": str(e)}