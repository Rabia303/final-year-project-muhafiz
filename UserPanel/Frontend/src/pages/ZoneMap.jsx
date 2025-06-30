
import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const zoneIcons = {
  RED: L.divIcon({
    className: "custom-marker red",
    html: '<div class="marker-inner"><div class="pulse"></div></div>',
    iconSize: [30, 30]
  }),
  ORANGE: L.divIcon({
    className: "custom-marker orange",
    html: '<div class="marker-inner"></div>',
    iconSize: [25, 25]
  }),
  YELLOW: L.divIcon({
    className: "custom-marker yellow",
    html: '<div class="marker-inner"></div>',
    iconSize: [20, 20]
  }),
  GREEN: L.divIcon({
    className: "custom-marker green",
    html: '<div class="marker-inner"></div>',
    iconSize: [15, 15]
  }),
};

export default function ZoneMap() {
  const [zones, setZones] = useState([]);
  const [summary, setSummary] = useState({ RED: 0, ORANGE: 0, YELLOW: 0, GREEN: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeZone, setActiveZone] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/zones");
        const data = response.data;

        const validZones = data.zones.filter(
          (zone) =>
            zone.lat && zone.lng && !isNaN(zone.lat) && !isNaN(zone.lng) && zone.zone
        );

        setZones(validZones);

        const count = { RED: 0, ORANGE: 0, YELLOW: 0, GREEN: 0 };
        validZones.forEach((zone) => {
          const type = zone.zone.toUpperCase();
          if (count[type] !== undefined) count[type]++;
        });
        setSummary(count);
      } catch (err) {
        setError("Error loading zone data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSafetyAssessment = () => {
    const total = zones.length;
    if (total === 0) return { message: "⏳ Loading safety assessment...", level: "loading" };

    const redPercent = (summary.RED / total) * 100;
    if (redPercent > 20) return { message: "⚠️ High-risk areas detected across Karachi", level: "critical" };
    if (redPercent > 10) return { message: "⚠️ Moderate-risk areas present", level: "warning" };
    if (summary.RED > 0) return { message: "⚠️ Some high-risk zones exist", level: "warning" };
    if (summary.ORANGE > 0) return { message: "🟠 Mostly safe with some risks", level: "notice" };
    return { message: "✅ Karachi appears safe", level: "safe" };
  };

  const safetyAssessment = getSafetyAssessment();

  return (
    <div className="zone-map-container" style={{marginTop:'150px',marginBottom:'550px'}}>
      <div className="header">
        <div className="header-content">
          <h1>🛡️ Karachi Risk Zone Map</h1>
          <p className="subtitle">Real-time safety assessment of Karachi neighborhoods</p>
        </div>
        <div className={`safety-alert ${safetyAssessment.level}`}>
          <div className="alert-content">
            <div className="alert-icon">
              {safetyAssessment.level === "critical" && "🔥"}
              {safetyAssessment.level === "warning" && "⚠️"}
              {safetyAssessment.level === "notice" && "ℹ️"}
              {safetyAssessment.level === "safe" && "✅"}
              {safetyAssessment.level === "loading" && "⏳"}
            </div>
            <div className="alert-text">
              <h3>Safety Assessment</h3>
              <p>{safetyAssessment.message}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard">
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading zone data...</p>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <div className="map-container">
          <MapContainer center={[24.8607, 67.0011]} zoom={12} className="map">
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            />
            {zones.map((zone, i) => (
              <Marker
                key={i}
                position={[zone.lat, zone.lng]}
                icon={zoneIcons[zone.zone.toUpperCase()] || zoneIcons.GREEN}
                eventHandlers={{
                  click: () => {
                    setActiveZone(zone);
                  },
                }}
              >
                <Popup>
                  <strong>{zone.zone} ZONE</strong><br />
                  Subdivision: {zone.subdivision || "N/A"}<br />
                  Town: {zone.town || "N/A"}<br />
                  Source: {zone.source}
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="map-legend">
            <div className="legend-title">Zone Legend</div>
            <div className="legend-item">
              <span className="legend-marker red"></span>
              <span style={{color:'black'}}>Red Zone (High Risk)</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker orange"></span>
              <span style={{color:'black'}}>Orange Zone (Moderate Risk)</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker yellow"></span>
              <span style={{color:'black'}}>Yellow Zone (Low Risk)</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker green"></span>
              <span style={{color:'black'}}>Green Zone (Safe)</span>
            </div>
          </div>
        </div>

        <div className="info-panel">
          <div className="summary-section">
            <h2>📊 Zone Distribution</h2>
            <div className="summary-grid">
              <div className="summary-card red">
                <div className="card-content">
                  <div className="card-title">Red Zones</div>
                  <div className="card-value">{summary.RED}</div>
                  <div className="card-percent">
                    {zones.length > 0 ? `${Math.round((summary.RED / zones.length) * 100)}%` : "0%"}
                  </div>
                </div>
              </div>
              <div className="summary-card orange">
                <div className="card-content">
                  <div className="card-title">Orange Zones</div>
                  <div className="card-value">{summary.ORANGE}</div>
                  <div className="card-percent">
                    {zones.length > 0 ? `${Math.round((summary.ORANGE / zones.length) * 100)}%` : "0%"}
                  </div>
                </div>
              </div>
              <div className="summary-card yellow">
                <div className="card-content">
                  <div className="card-title">Yellow Zones</div>
                  <div className="card-value">{summary.YELLOW}</div>
                  <div className="card-percent">
                    {zones.length > 0 ? `${Math.round((summary.YELLOW / zones.length) * 100)}%` : "0%"}
                  </div>
                </div>
              </div>
              <div className="summary-card green">
                <div className="card-content">
                  <div className="card-title">Green Zones</div>
                  <div className="card-value">{summary.GREEN}</div>
                  <div className="card-percent">
                    {zones.length > 0 ? `${Math.round((summary.GREEN / zones.length) * 100)}%` : "0%"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h2>📍 Zone Details</h2>
            {activeZone ? (
              <div className="zone-details">
                <div className={`zone-header ${activeZone.zone.toLowerCase()}`}>
                  <h3>{activeZone.zone} ZONE</h3>
                </div>
                <div className="zone-info">
                  <div className="info-row">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{activeZone.subdivision || "N/A"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Town:</span>
                    <span className="info-value">{activeZone.town || "N/A"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Coordinates:</span>
                    <span className="info-value">{activeZone.lat.toFixed(4)}, {activeZone.lng.toFixed(4)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Source:</span>
                    <span className="info-value">{activeZone.source}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <p>Select a zone on the map to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
          background-color: #f5f7fa;
          color: #333;
        }
        
        .zone-map-container {
          max-width: 1800px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #1a2a6c, #2c3e50);
          min-height: 100vh;
          color: white;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .header-content h1 {
          font-size: 2.5rem;
          margin-bottom: 8px;
          background: linear-gradient(to right, #ffffff, #4facfe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .subtitle {
          font-size: 1.1rem;
          color: #cbd5e0;
          max-width: 600px;
        }
        
        .safety-alert {
          padding: 20px;
          border-radius: 12px;
          min-width: 300px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .safety-alert.critical {
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          border-left: 5px solid #ff0000;
        }
        
        .safety-alert.warning {
          background: linear-gradient(135deg, #ff9966, #ff5e62);
          border-left: 5px solid #ff8800;
        }
        
        .safety-alert.notice {
          background: linear-gradient(135deg, #2193b0, #6dd5ed);
          border-left: 5px solid #0077cc;
        }
        
        .safety-alert.safe {
          background: linear-gradient(135deg, #00b09b, #96c93d);
          border-left: 5px solid #00cc66;
        }
        
        .safety-alert.loading {
          background: linear-gradient(135deg, #4b6cb7, #182848);
          border-left: 5px solid #4b6cb7;
        }
        
        .alert-content {
          display: flex;
          align-items: center;
        }
        
        .alert-icon {
          font-size: 2.5rem;
          margin-right: 15px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }
        
        .alert-text h3 {
          font-size: 1.3rem;
          margin-bottom: 5px;
        }
        
        .dashboard {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
          height: calc(100vh - 180px);
        }
        
        .map-container {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          height: 100%;
        }
        
        .map {
          height: 100%;
          width: 100%;
          z-index: 1;
        }
        
        .map-legend {
          position: absolute;
          bottom: 20px;
          left: 20px;
          z-index: 1000;
          background: rgba(30, 30, 40, 0.85);
          padding: 15px;
          border-radius: 10px;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .legend-title {
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 1.1rem;
          color: #fff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding-bottom: 5px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          margin: 8px 0;
        }
        
        .legend-marker {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 10px;
          border: 2px solid white;
        }
        
        .legend-marker.red { background-color: #ff4d4d; }
        .legend-marker.orange { background-color: #ffa64d; }
        .legend-marker.yellow { background-color: #ffff66; }
        .legend-marker.green { background-color: #66ff66; }
        
        .info-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .summary-section, .details-section {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          height: 100%;
        }
        
        .summary-section h2, .details-section h2 {
          margin-bottom: 20px;
          font-size: 1.5rem;
          color: #ffffff;
          border-bottom: 2px solid rgba(255, 255, 255, 0.2);
          padding-bottom: 10px;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        
        .summary-card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
        }
        
        .summary-card:hover {
          transform: translateY(-5px);
        }
        
        .summary-card.red { background: linear-gradient(135deg, #ff416c, #ff4b2b); }
        .summary-card.orange { background: linear-gradient(135deg, #ff9966, #ff5e62); }
        .summary-card.yellow { background: linear-gradient(135deg, #f9d423, #ff9800); }
        .summary-card.green { background: linear-gradient(135deg, #00b09b, #96c93d); }
        
        .card-content {
          padding: 20px;
          text-align: center;
          color: white;
        }
        
        .card-title {
          font-size: 1.2rem;
          margin-bottom: 10px;
          font-weight: 600;
        }
        
        .card-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 10px 0;
        }
        
        .card-percent {
          font-size: 1.1rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 5px 10px;
          border-radius: 20px;
          display: inline-block;
        }
        
        .zone-details {
          background: rgba(30, 30, 40, 0.9);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .zone-header {
          padding: 15px 20px;
          text-align: center;
        }
        
        .zone-header.red { background: linear-gradient(135deg, #ff416c, #ff4b2b); }
        .zone-header.orange { background: linear-gradient(135deg, #ff9966, #ff5e62); }
        .zone-header.yellow { background: linear-gradient(135deg, #f9d423, #ff9800); }
        .zone-header.green { background: linear-gradient(135deg, #00b09b, #96c93d); }
        
        .zone-header h3 {
          font-size: 1.5rem;
          color: white;
        }
        
        .zone-info {
          padding: 20px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .info-label {
          font-weight: 600;
          color: #a0aec0;
        }
        
        .info-value {
          font-weight: 500;
          text-align: right;
        }
        
        .no-selection {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #a0aec0;
          font-style: italic;
        }
        
        .loader-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          border-radius: 16px;
        }
        
        .loader {
          border: 5px solid rgba(255, 255, 255, 0.2);
          border-top: 5px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error {
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
          font-weight: 600;
        }
        
        /* Custom marker styles */
        .custom-marker {
          background: transparent;
          border: none;
        }
        
        .marker-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        
        .custom-marker.red .marker-inner { background: radial-gradient(circle, #ff4d4d, #cc0000); }
        .custom-marker.orange .marker-inner { background: radial-gradient(circle, #ffa64d, #e67300); }
        .custom-marker.yellow .marker-inner { background: radial-gradient(circle, #ffff66, #e6e600); }
        .custom-marker.green .marker-inner { background: radial-gradient(circle, #66ff66, #00cc00); }
        
        .pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: inherit;
          animation: pulse 2s infinite;
          z-index: -1;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(2.5); opacity: 0; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}