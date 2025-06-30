import osmnx as ox
import networkx as nx
import json

print("Downloading Karachi road network...")

# Step 1: Load road network
G = ox.graph_from_place("Karachi, Pakistan", network_type="drive")

# Step 2: Convert to undirected cleanly
G = nx.Graph(G)

# Step 3: Remove any non-serializable attributes like 'geometry'
for u, v, data in G.edges(data=True):
    if 'geometry' in data:
        del data['geometry']

# Step 4: Export to JSON safely
data = nx.node_link_data(G)
with open("road_graph.json", "w") as f:
    json.dump(data, f)

print(f"Saved graph with {len(G.nodes)} nodes and {len(G.edges)} edges.")
