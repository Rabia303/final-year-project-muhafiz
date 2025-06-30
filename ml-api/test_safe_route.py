import pytest
from safe_route import find_safest_path

# Mock start and end points from Karachi
karachi_point_a = {'lat': 24.8607, 'lng': 67.0011}  # Saddar
karachi_point_b = {'lat': 24.9263, 'lng': 67.0220}  # Gulshan

def test_safe_route_success():
    result = find_safest_path(karachi_point_a, karachi_point_b)

    assert result["success"] == True
    assert "route" in result
    assert len(result["route"]) > 0
    assert isinstance(result["distance_km"], float)
    assert isinstance(result["zone_summary"], dict)

def test_missing_input():
    result = find_safest_path({}, {})
    assert result["success"] == False
    assert "error" in result
