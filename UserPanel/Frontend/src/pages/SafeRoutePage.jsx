import { useState } from 'react';
import {
  FiClock,
  FiActivity,
  FiNavigation,
  FiMapPin,
  FiAlertTriangle,
  FiShield,
  FiFlag,
  FiUsers, 
  FiArrowRight,
  FiMap
} from 'react-icons/fi';


export default function RoutePlanner() {
  const [selectedRoute, setSelectedRoute] = useState('safest');

  return (
    <div className="route-container" style={{marginTop:'79px'}}>
      {/* Header */}
      <div className="route-header" >
        <h1 ><FiNavigation /> MultiSafeRoute Planner</h1>
        <p className='para'>Choose the safest path to your destination</p>
      </div>

      {/* Map Visualization */}
      <div className="route-map-visual">
        <div className="map-placeholder">
          <img src="https://images.squarespace-cdn.com/content/v1/524883b7e4b03fcb7c64e24c/1443035740954-0KYX5313WPOAVCH44RIQ/image-asset.png?format=2500w" alt="Route visualization" />
          <div className="route-overlay">
            <span className="start-pin"><FiMapPin /> You</span>
            <span className="end-pin"><FiFlag /> Destination</span>
          </div>
        </div>
      </div>

      {/* Route Options */}
      <div className="route-options">
        <h2><FiActivity /> Route Options</h2>

        {/* Safest */}
        <div
          className={`route-card ${selectedRoute === 'safest' ? 'active' : ''}`}
          onClick={() => setSelectedRoute('safest')}
        >
          <div className="route-icon safest">
            <FiShield />
          </div>
          <div className="route-details">
            <h3>Safest Route</h3>
            <p>Safety: <span className="high">High</span> • 3.2 km</p>
            <div className="route-meta">
              <span><FiClock /> 25 mins</span>
              <span><FiUsers /> Crowded areas</span>
            </div>
          </div>
        </div>

        {/* Fastest */}
        <div
          className={`route-card ${selectedRoute === 'fastest' ? 'active' : ''}`}
          onClick={() => setSelectedRoute('fastest')}
        >
          <div className="route-icon fastest">
            <FiNavigation />
          </div>
          <div className="route-details">
            <h3>Fastest Route</h3>
            <p>Safety: <span className="medium">Medium</span> • 2.5 km</p>
            <div className="route-meta">
              <span><FiClock /> 18 mins</span>
              <span><FiAlertTriangle /> 2 alerts</span>
            </div>
          </div>
        </div>

        {/* Balanced */}
        <div
          className={`route-card ${selectedRoute === 'balanced' ? 'active' : ''}`}
          onClick={() => setSelectedRoute('balanced')}
        >
          <div className="route-icon balanced">
            <FiActivity />
          </div>
          <div className="route-details">
            <h3>Balanced Route</h3>
            <p>Safety: <span className="medium-high">Medium-High</span> • 2.8 km</p>
            <div className="route-meta">
              <span><FiClock /> 22 mins</span>
              <span><FiUsers /> Mostly safe</span>
            </div>
          </div>
        </div>

        <button className="start-navigation-btn">
          Start Navigation <FiArrowRight />
        </button>
      </div>

      {/* Route Details */}
      <div className="route-details-section">
        <h2><FiMap /> Route Details</h2>
        <div className="safety-info">
          <div className="safety-badge high">
            <FiShield /> 94% Safety Score
          </div>
          <p>
            This route avoids all known high-risk areas (3 danger zones bypassed)
            and stays on well-lit, populated streets with 24/7 surveillance coverage.
          </p>
          <ul className="safety-features">
            <li><FiShield /> 5 Safe Havens along route</li>
            <li><FiClock /> Well-lit until 2AM</li>
            <li><FiUsers /> High foot traffic</li>
          </ul>
        </div>
      </div>

    
             
    </div>
  );
}
