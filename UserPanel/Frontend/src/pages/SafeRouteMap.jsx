import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker, Polyline
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../SafeRouteMap.css';
import { FaRoute, FaMapMarkerAlt, FaWalking, FaCar, FaBalanceScale, FaRedo, FaInfoCircle } from 'react-icons/fa';

const zoneColors = {
  RED: '#ff4d4d',
  ORANGE: '#ffa64d',
  YELLOW: '#ffff66',
  GREEN: '#66ff66',
};

const routeTypeIcons = {
  safest: <FaWalking className="route-icon" />,
  fastest: <FaCar className="route-icon" />,
  balanced: <FaBalanceScale className="route-icon" />
};

const routeTypeColors = {
  safest: '#3b82f6',
  fastest: '#10b981',
  balanced: '#f59e0b'
};

const SafeRouteMap = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [zones, setZones] = useState([]);
  const [clickMode, setClickMode] = useState("none");
  const [loading, setLoading] = useState(false);
  const [addressInputs, setAddressInputs] = useState({
    start: "",
    end: ""
  });
  const [error, setError] = useState(null);
  const [allRoutes, setAllRoutes] = useState(null);
  const [selectedType, setSelectedType] = useState("safest");
  const [routeDetailsExpanded, setRouteDetailsExpanded] = useState(false);
  const [geocodeSuggestions, setGeocodeSuggestions] = useState({
    start: [],
    end: []
  });
  
  const navigate = useNavigate();

  const handleStartNavigation = () => {
    if (!allRoutes || !selectedType) {
      setError("Please select a route first");
      return;
    }
    
    const selectedRouteData = allRoutes[selectedType];

    navigate("/navigation", {
      state: {
        route: selectedRouteData.route,
        start,
        end,
        type: selectedType,
        zone_summary: selectedRouteData.zone_summary,
        safety_score: selectedRouteData.safety_score
      }
    });
  };

  const getSafeRoute = async () => {
    if (!start || !end) {
      setError("Please select both start and end points");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAllRoutes(null);

      const res = await axios.post("http://localhost:5000/api/safe-route", { start, end });

      if (res.data.success) {
        setAllRoutes(res.data);
        setSelectedType("safest");
      } else {
        setError(res.data.error || "Failed to calculate route");
      }
    } catch (err) {
      console.error("Route fetch error:", err);
      setError("Route calculation failed. Please try different locations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/zones");
        setZones(res.data.zones);
      } catch (err) {
        console.error("Zone fetch failed", err);
        setError("Failed to load crime zone data");
      }
    };

    fetchZones();
  }, []);

  const LocationClick = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (clickMode === "start") {
          setStart({ lat, lng });
          setClickMode("none");
        } else if (clickMode === "end") {
          setEnd({ lat, lng });
          setClickMode("none");
        }
      },
    });
    return null;
  };

  const handleGeocode = async (place, type) => {
    if (!place) return;

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${place}&countrycodes=PK&limit=5`
      );

      if (res.data && res.data.length > 0) {
        // Store suggestions
        setGeocodeSuggestions(prev => ({
          ...prev,
          [type]: res.data
        }));
      } else {
        setError("Location not found in Karachi. Please try a different name.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Geocoding service unavailable. Please use map selection.");
    }
  };

  const selectLocation = (location, type) => {
    const coords = { 
      lat: parseFloat(location.lat), 
      lng: parseFloat(location.lon) 
    };

    if (type === "start") {
      setStart(coords);
      setAddressInputs(prev => ({ ...prev, start: location.display_name }));
    } else {
      setEnd(coords);
      setAddressInputs(prev => ({ ...prev, end: location.display_name }));
    }
    
    // Clear suggestions
    setGeocodeSuggestions(prev => ({
      ...prev,
      [type]: []
    }));
  };

  const AnimatedPolyline = ({ positions, color }) => (
    <Polyline
      positions={positions}
      pathOptions={{
        color,
        weight: 6,
        dashArray: '20, 20',
        className: 'animated-dash'
      }}
    />
  );

  const getSafetyLevel = (score) => {
    if (score >= 90) return { label: "Very Safe", color: "#10b981" };
    if (score >= 70) return { label: "Safe", color: "#22c55e" };
    if (score >= 50) return { label: "Moderate", color: "#f59e0b" };
    if (score >= 30) return { label: "Risky", color: "#ef4444" };
    return { label: "Dangerous", color: "#b91c1c" };
  };

  const renderZoneSummary = (zoneSummary) => {
    const total = Object.values(zoneSummary).reduce((sum, val) => sum + val, 0);

    return (
      <div className="zone-summary-grid">
        {Object.entries(zoneSummary).map(([zone, count]) => (
          <div key={zone} className="zone-summary-item">
            <div className="zone-label" style={{ backgroundColor: zoneColors[zone] }}>
              {zone}
            </div>
            <div className="zone-count">{count}</div>
            <div className="zone-percentage">
              {total > 0 ? Math.round((count / total) * 100) : 0}%
            </div>
            <div className="zone-bar-container">
              <div
                className="zone-bar"
                style={{
                  width: `${total > 0 ? (count / total) * 100 : 0}%`,
                  backgroundColor: zoneColors[zone]
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const resetRoute = () => {
    setAllRoutes(null);
    setSelectedType("safest");
    setStart(null);
    setEnd(null);
    setAddressInputs({ start: "", end: "" });
    setError(null);
    setGeocodeSuggestions({ start: [], end: [] });
  };

  // Custom marker icons
  const startIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="marker-container">
        <div class="marker-label" style="background: #10b981;">START</div>
        <div class="start-marker">
          <div class="marker-pulse"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });

  const endIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="marker-container">
        <div class="marker-label" style="background: #ef4444;">END</div>
        <div class="end-marker">
          <div class="marker-pulse"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
  
  const getZoneIcon = (zone) => {
    const sizeMap = {
      RED: 36,
      ORANGE: 28,
      YELLOW: 20,
      GREEN: 16
    };

    const glowMap = {
      RED: '0 0 15px 8px rgba(255, 77, 77, 0.7)',
      ORANGE: '0 0 12px 6px rgba(255, 166, 77, 0.6)',
      YELLOW: '0 0 8px 4px rgba(255, 255, 102, 0.5)',
      GREEN: '0 0 6px 3px rgba(102, 255, 102, 0.4)'
    };

    const color = zoneColors[zone] || '#888';
    const size = sizeMap[zone] || 16;
    const glow = glowMap[zone] || 'none';

    return L.divIcon({
      className: `zone-marker ${zone.toLowerCase()}-zone`,
      html: `
      <div class="zone-outer" style="
        width: ${size}px;
        height: ${size}px;
        box-shadow: ${glow};
      ">
        <div class="zone-inner" style="
          background: radial-gradient(circle at 30% 30%, ${color}, ${darkenColor(color, 30)});
        "></div>
      </div>
    `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  };

  // Helper function to darken colors
  const darkenColor = (color, percent) => {
    // Simplified darkening for our specific colors
    if (color === '#ff4d4d') return '#cc0000';
    if (color === '#ffa64d') return '#cc7a00';
    if (color === '#ffff66') return '#cccc00';
    if (color === '#66ff66') return '#00cc00';
    return color;
  };

  return (
    <div className="safe-route-container">
      <style>{`
  @keyframes dash { to { stroke-dashoffset: -40; } }
  .animated-dash { animation: dash 1s linear infinite; }
`}</style>

      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Safest Route Finder</h1>
          <p className="app-subtitle">Navigate Karachi safely with crime-aware routing</p>
          <div className="app-actions">
            <button
              className="reset-button"
              onClick={resetRoute}
              title="Reset route"
            >
              <FaRedo /> Reset
            </button>
          </div>
        </div>
      </header>

      {/* Controls Section */}
      <div className="controls-card">
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">
          Start Point
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Enter area name or click map"
                value={addressInputs.start}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddressInputs(prev => ({ ...prev, start: value }));
                  if (value.length > 2) {
                    handleGeocode(value, "start");
                  }
                }}
                onBlur={() => setTimeout(() => setGeocodeSuggestions(prev => ({...prev, start: []})), 200)}
              />
              <button
                onClick={() => setClickMode("start")}
                className={`map-button ${clickMode === "start" ? 'active' : ''}`}
              >
                <FaMapMarkerAlt /> Map
              </button>
            </div>
            
            {geocodeSuggestions.start.length > 0 && (
              <div className="suggestions-dropdown">
                {geocodeSuggestions.start.map((location, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item"
                    onMouseDown={() => selectLocation(location, "start")}
                  >
                    {location.display_name}
                  </div>
                ))}
              </div>
            )}
            
            {start && (
              <div className="coordinates-display">
                {start.lat.toFixed(5)}, {start.lng.toFixed(5)}
              </div>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">
              End Point
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Enter area name or click map"
                value={addressInputs.end}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddressInputs(prev => ({ ...prev, end: value }));
                  if (value.length > 2) {
                    handleGeocode(value, "end");
                  }
                }}
                onBlur={() => setTimeout(() => setGeocodeSuggestions(prev => ({...prev, end: []})), 200)}
              />
              <button
                onClick={() => setClickMode("end")}
                className={`map-button ${clickMode === "end" ? 'active' : ''}`}
              >
                <FaMapMarkerAlt /> Map
              </button>
            </div>
            
            {geocodeSuggestions.end.length > 0 && (
              <div className="suggestions-dropdown">
                {geocodeSuggestions.end.map((location, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item"
                    onMouseDown={() => selectLocation(location, "end")}
                  >
                    {location.display_name}
                  </div>
                ))}
              </div>
            )}
            
            {end && (
              <div className="coordinates-display">
                {end.lat.toFixed(5)}, {end.lng.toFixed(5)}
              </div>
            )}
          </div>
        </div>

        <div className="action-button-container">
          <button
            onClick={getSafeRoute}
            disabled={loading || !start || !end}
            className="route-button"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Calculating Routes...
              </>
            ) : (
              <>
                <FaRoute className="route-icon" />
                Find Safe Routes
              </>
            )}
          </button>
          <button
            className='route-button'
            onClick={handleStartNavigation}
            disabled={!allRoutes}
          >

            <FaInfoCircle className="info-icon" />
            Start Navigation
          </button>
        </div>

        {error && (
          <div className="error-message">
            <FaInfoCircle className="error-icon" />
            {error}
          </div>
        )}
      </div>

      {/* Route Selection Cards */}
      {allRoutes && (
        <div className="route-cards-container">
          {['safest', 'fastest', 'balanced'].map((type) => {
            const route = allRoutes[type];
            const safetyInfo = getSafetyLevel(route.safety_score);

            return (
              <div
                key={type}
                className={`route-card ${selectedType === type ? "selected" : ""}`}
                onClick={() => setSelectedType(type)}
                style={{ borderColor: routeTypeColors[type] }}
              >
                <div className="route-card-header">
                  <div className="route-type-icon" style={{ color: routeTypeColors[type] }}>
                    {routeTypeIcons[type]}
                  </div>
                  <div className="route-card-title">
                    <h4>{type.charAt(0).toUpperCase() + type.slice(1)} Route</h4>
                    <div className="route-card-subtitle">
                      {route.distance_km} km • {route.waypoints} points
                    </div>
                  </div>
                </div>

                <div className="safety-indicator">
                  <div className="safety-label" style={{ backgroundColor: safetyInfo.color }}>
                    {safetyInfo.label}
                  </div>
                  <div className="safety-score">
                    Safety: {route.safety_score}%
                  </div>
                </div>

                <div className="route-stats">
                  <div className="route-stat">
                    <div className="stat-label">Red Zones</div>
                    <div className="stat-value">{route.zone_summary.RED || 0}</div>
                  </div>
                  <div className="route-stat">
                    <div className="stat-label">Bypassed</div>
                    <div className="stat-value">{route.red_zones_bypassed}</div>
                  </div>
                  <div className="route-stat">
                    <div className="stat-label">Time</div>
                    <div className="stat-value">~{Math.round(route.distance_km * 3)} min</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Map and Summary Section */}
      <div className="content-container">
        <div className="map-section">
          <div className="map-card">
            <MapContainer
              center={start || [24.88, 67.03]}
              zoom={start ? 14 : 12}
              className="map-container"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationClick />

              {zones.map((z, i) => (
                <Marker
                  key={i}
                  position={[z.lat, z.lng]}
                  icon={getZoneIcon(z.zone)}
                >
                  <Popup>
                    <b>{z.subdivision}</b><br />
                    <span className={`zone-tag zone-${z.zone.toLowerCase()}`}>
                      {z.zone} zone
                    </span><br />
                    Source: {z.source}
                  </Popup>
                </Marker>
              ))}

              {start && (
                <Marker
                  position={[start.lat, start.lng]}
                  icon={startIcon}
                >
                  <Popup>Start Point</Popup>
                </Marker>
              )}

              {end && (
                <Marker
                  position={[end.lat, end.lng]}
                  icon={endIcon}
                >
                  <Popup>End Point</Popup>
                </Marker>
              )}

              {allRoutes && allRoutes[selectedType]?.route && (
                <AnimatedPolyline
                  positions={allRoutes[selectedType].route}
                  color={routeTypeColors[selectedType]}
                />
              )}
            </MapContainer>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="summary-section">
          {allRoutes ? (
            <div className="summary-card">
              <div className="summary-header">
                <h3>{selectedType.toUpperCase()} Route Details</h3>
                <button
                  className="expand-button"
                  onClick={() => setRouteDetailsExpanded(!routeDetailsExpanded)}
                >
                  {routeDetailsExpanded ? "Show Less" : "Show More"}
                </button>
              </div>

              <div className="route-highlights">
                <div className="highlight-card">
                  <div className="highlight-value">{allRoutes[selectedType].distance_km} km</div>
                  <div className="highlight-label">Distance</div>
                </div>

                <div className="highlight-card">
                  <div className="highlight-value" style={{ color: getSafetyLevel(allRoutes[selectedType].safety_score).color }}>
                    {allRoutes[selectedType].safety_score}%
                  </div>
                  <div className="highlight-label">Safety Score</div>
                </div>

                <div className="highlight-card">
                  <div className="highlight-value">{allRoutes[selectedType].red_zones_bypassed}</div>
                  <div className="highlight-label">Red Zones Avoided</div>
                </div>
              </div>

              <div className="section-title">Zone Breakdown</div>
              {renderZoneSummary(allRoutes[selectedType].zone_summary)}

              {routeDetailsExpanded && (
                <>
                  <div className="section-title">Route Features</div>
                  <div className="route-features">
                    <div className="feature">
                      <div className="feature-icon">💡</div>
                      <div className="feature-text">
                        <b>Lighting:</b> {allRoutes[selectedType].extra.light_status}
                      </div>
                    </div>
                    <div className="feature">
                      <div className="feature-icon">👥</div>
                      <div className="feature-text">
                        <b>Foot Traffic:</b> {allRoutes[selectedType].extra.crowd_status}
                      </div>
                    </div>
                    <div className="feature">
                      <div className="feature-icon">📹</div>
                      <div className="feature-text">
                        <b>Surveillance:</b> {allRoutes[selectedType].extra.surveillance ? "Available" : "Limited"}
                      </div>
                    </div>
                    <div className="feature">
                      <div className="feature-icon">🛡️</div>
                      <div className="feature-text">
                        <b>Safe Havens:</b> {allRoutes[selectedType].extra.safe_havens} police stations along route
                      </div>
                    </div>
                  </div>

                  <div className="section-title">Safety Tips</div>
                  <ul className="safety-tips">
                    <li>Travel during daylight hours when possible</li>
                    <li>Stay in well-lit areas with other people around</li>
                    <li>Keep valuables out of sight</li>
                    <li>Share your route with someone you trust</li>
                  </ul>
                </>
              )}
            </div>
          ) : (
            <div className="summary-card placeholder">
              <div className="placeholder-icon">
                <FaRoute />
              </div>
              <h3>No Route Selected</h3>
              <p>Select start and end points, then click "Find Safe Routes" to calculate your safest path</p>
              <div className="info-tip">
                <FaInfoCircle /> Tip: You can click the map or search for locations
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="legend-container">
        <div className="legend-card">
          <h4>Map Legend</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-icon start"></div>
              <div className="legend-text">Start Point</div>
            </div>
            <div className="legend-item">
              <div className="legend-icon end"></div>
              <div className="legend-text">End Point</div>
            </div>
            {allRoutes && (
              <div className="legend-item">
                <div className="legend-icon" style={{ backgroundColor: routeTypeColors[selectedType] }}></div>
                <div className="legend-text">Selected Route</div>
              </div>
            )}
            <div className="legend-item">
              <div className="legend-icon" style={{ backgroundColor: zoneColors.RED }}></div>
              <div className="legend-text">High Risk (Red)</div>
            </div>
            <div className="legend-item">
              <div className="legend-icon" style={{ backgroundColor: zoneColors.ORANGE }}></div>
              <div className="legend-text">Moderate Risk (Orange)</div>
            </div>
            <div className="legend-item">
              <div className="legend-icon" style={{ backgroundColor: zoneColors.YELLOW }}></div>
              <div className="legend-text">Low Risk (Yellow)</div>
            </div>
            <div className="legend-item">
              <div className="legend-icon" style={{ backgroundColor: zoneColors.GREEN }}></div>
              <div className="legend-text">Safe (Green)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeRouteMap;