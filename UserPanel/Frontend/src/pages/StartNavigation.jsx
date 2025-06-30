import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import '../StartNavigation.css';
import { FaArrowLeft, FaLocationArrow, FaWalking, FaCar, FaBalanceScale } from 'react-icons/fa';

const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = (val) => (val * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getBearing = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - 
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const bearing = Math.atan2(y, x);
  return (bearing * 180 / Math.PI + 360) % 360;
};

const getDirection = (bearing) => {
  const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

const getManeuverType = (prevBearing, currentBearing) => {
  const angleDiff = Math.abs(prevBearing - currentBearing);
  if (angleDiff > 330) angleDiff = 360 - angleDiff; // Handle wrap-around
  
  if (angleDiff < 30) return 'continue';
  if (angleDiff > 150) return 'uturn';
  if (currentBearing > prevBearing) {
    return angleDiff > 120 ? 'sharp right' : angleDiff > 60 ? 'right' : 'slight right';
  } else {
    return angleDiff > 120 ? 'sharp left' : angleDiff > 60 ? 'left' : 'slight left';
  }
};

const getInstruction = (currentPoint, nextPoint, prevBearing) => {
  if (!nextPoint) return "You have arrived at your destination";
  
  const distance = haversineDistance(
    currentPoint.lat, currentPoint.lng,
    nextPoint.lat, nextPoint.lng
  );
  
  const bearing = getBearing(
    currentPoint.lat, currentPoint.lng,
    nextPoint.lat, nextPoint.lng
  );
  
  const direction = getDirection(bearing);
  const maneuver = prevBearing ? getManeuverType(prevBearing, bearing) : 'start';
  
  if (maneuver === 'continue') {
    if (distance < 50) return "Continue straight ahead";
    return `Continue straight for ${Math.round(distance)} meters`;
  }
  
  if (maneuver === 'uturn') {
    if (distance < 100) return "Make a U-turn soon";
    return `In ${Math.round(distance)} meters, make a U-turn`;
  }
  
  if (distance < 50) {
    return `Prepare to turn ${maneuver.includes('right') ? 'right' : 'left'}`;
  }
  
  return `In ${Math.round(distance)} meters, turn ${maneuver.includes('right') ? 'right' : 'left'}`;
};

const FollowUserMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], 18);
    }
  }, [position]);
  return null;
};

const StartNavigation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { route, start, end, type, zone_summary, safety_score } = state || {};
  
  const [position, setPosition] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [eta, setEta] = useState(0);
  const [distanceRemaining, setDistanceRemaining] = useState(0);
  const [inHighRiskZone, setInHighRiskZone] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  
  const prevPositionRef = useRef(null);
  const instructionsRef = useRef([]);
  const routePointsRef = useRef([]);
  const timerRef = useRef(null);
  
  // Initialize route data
  useEffect(() => {
    if (route) {
      routePointsRef.current = route.map((pt, i) => ({
        lat: pt[0],
        lng: pt[1],
        id: i
      }));
      
      // Calculate total distance
      let totalDistance = 0;
      for (let i = 0; i < route.length - 1; i++) {
        totalDistance += haversineDistance(
          route[i][0], route[i][1],
          route[i+1][0], route[i+1][1]
        );
      }
      setDistanceRemaining(totalDistance);
      
      // Estimate ETA (5km/h walking speed)
      setEta(Math.round(totalDistance / 1.4)); // in minutes (1.4 m/s ≈ 5 km/h)
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [route]);
  
  if (!state || !route) {
    return (
      <div className="navigation-container">
        <div className="error-screen">
          <h2>Route Not Found</h2>
          <p>Please go back and select a route first</p>
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
      </div>
    );
  }

  // Generate instructions for each segment
  const generateInstructions = () => {
    if (!routePointsRef.current.length) return [];
    
    const instructions = [];
    let prevBearing = null;
    
    for (let i = 0; i < routePointsRef.current.length - 1; i++) {
      const currentPoint = routePointsRef.current[i];
      const nextPoint = routePointsRef.current[i+1];
      
      if (i > 0) {
        prevBearing = getBearing(
          routePointsRef.current[i-1].lat, routePointsRef.current[i-1].lng,
          currentPoint.lat, currentPoint.lng
        );
      }
      
      const instruction = getInstruction(currentPoint, nextPoint, prevBearing);
      instructions.push({
        ...nextPoint,
        instruction,
        distance: haversineDistance(
          currentPoint.lat, currentPoint.lng,
          nextPoint.lat, nextPoint.lng
        )
      });
    }
    
    // Add final destination instruction
    instructions.push({
      ...routePointsRef.current[routePointsRef.current.length - 1],
      instruction: "You have arrived at your destination",
      distance: 0
    });
    
    return instructions;
  };
const startTracking = () => {
  if (tracking) return;

  instructionsRef.current = generateInstructions();

  setTracking(true);
  setArrived(false);
  setCurrentStep(0);
  if (voiceGuidance) speak(instructionsRef.current[0].instruction);

  watchId.current = navigator.geolocation.watchPosition(
    (pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp
      };

      if (prevPositionRef.current) {
        const dist = haversineDistance(
          prevPositionRef.current.lat, prevPositionRef.current.lng,
          coords.lat, coords.lng
        );
        const timeDiff = (coords.timestamp - prevPositionRef.current.timestamp) / 1000;
        if (timeDiff > 0) {
          setSpeed(Math.round((dist / timeDiff) * 3.6));
        }
      }
      prevPositionRef.current = coords;

      setPosition(coords);
      updateNavigation(coords);
    },
    (err) => {
      console.error("Geolocation error:", err);
      if (voiceGuidance) speak("Unable to get your location. Please check location services.");
    },
    { 
      enableHighAccuracy: true, 
      timeout: 5000, 
      maximumAge: 0 
    }
  );

  // Start ETA countdown timer
  timerRef.current = setInterval(() => {
    setEta((prev) => Math.max(0, prev - 1));
  }, 60000);
};


  const stopTracking = () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (voiceGuidance) speak("Navigation stopped.");
    setTracking(false);
    navigate('/');
  };

  const updateNavigation = (userPos) => {
    // Find the closest point on the route
    let closestIndex = currentStep;
    let minDist = Infinity;
    
    // Only look ahead in the route
    for (let i = currentStep; i < routePointsRef.current.length; i++) {
      const dist = haversineDistance(
        userPos.lat, userPos.lng,
        routePointsRef.current[i].lat, routePointsRef.current[i].lng
      );
      
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    }
    
    // Update if we've moved to a new segment
    if (closestIndex > currentStep) {
      setCurrentStep(closestIndex);
      
      // Update distance remaining
      let remaining = 0;
      for (let i = closestIndex; i < routePointsRef.current.length - 1; i++) {
        remaining += haversineDistance(
          routePointsRef.current[i].lat, routePointsRef.current[i].lng,
          routePointsRef.current[i+1].lat, routePointsRef.current[i+1].lng
        );
      }
      setDistanceRemaining(remaining);
      
      // Speak instruction
      if (voiceGuidance && closestIndex < instructionsRef.current.length) {
        speak(instructionsRef.current[closestIndex].instruction);
      }
    }
    
    // Check if in high risk zone (simplified for demo)
    if (minDist < 100 && closestIndex < routePointsRef.current.length - 1) {
      // In a real app, this would check actual zone data
      const riskLevel = Math.random() > 0.7 ? 'high' : 'low';
      if (riskLevel === 'high' && !inHighRiskZone) {
        setInHighRiskZone(true);
        if (voiceGuidance) speak("Warning: Entering a high risk area. Stay alert.");
      } else if (riskLevel === 'low' && inHighRiskZone) {
        setInHighRiskZone(false);
      }
    }
    
    // Check if we've arrived
    const destDist = haversineDistance(
      userPos.lat, userPos.lng,
      end.lat, end.lng
    );
    
    if (destDist < 30 && !arrived) {
      setArrived(true);
      if (voiceGuidance) speak("You have arrived at your destination");
      setTimeout(stopTracking, 3000);
    }
  };

  const getSafetyColor = (score) => {
    if (score >= 90) return '#10B981';
    if (score >= 70) return '#22C55E';
    if (score >= 50) return '#F59E0B';
    if (score >= 30) return '#EF4444';
    return '#B91C1C';
  };

  const getRouteIcon = () => {
    switch(type) {
      case 'safest': return <FaWalking />;
      case 'fastest': return <FaCar />;
      default: return <FaBalanceScale />;
    }
  };

  const toggleVoiceGuidance = () => {
    setVoiceGuidance(!voiceGuidance);
  };

  return (
    <div className="navigation-container">
      {/* Top Navigation Bar */}
      <div className="nav-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft />
        </button>
        <div className="route-info">
          <div className="route-type" style={{ 
            backgroundColor: 
              type === 'safest' ? '#3b82f6' : 
              type === 'fastest' ? '#10b981' : '#f59e0b'
          }}>
            <span className="route-icon">{getRouteIcon()}</span>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
          <div className="safety-indicator">
            <div className="safety-gauge" style={{ 
              '--score': `${safety_score}%`,
              '--color': getSafetyColor(safety_score)
            }}>
              <span>{safety_score}%</span>
            </div>
            <span>Safety</span>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className={`voice-toggle ${voiceGuidance ? 'active' : ''}`}
            onClick={toggleVoiceGuidance}
          >
            🔊
          </button>
        </div>
      </div>

      {/* Main Map */}
      <div className="map-container">
        <MapContainer
          center={[start.lat, start.lng]}
          zoom={17}
          className="map"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {position && <FollowUserMap position={position} />}
          
          <Polyline
            positions={route.map(([lat, lng]) => [lat, lng])}
            pathOptions={{ 
              color: type === 'safest' ? '#3b82f6' : 
                     type === 'fastest' ? '#10b981' : '#f59e0b',
              weight: 6,
              opacity: 0.8
            }}
          />
          
          <Marker
            position={[start.lat, start.lng]}
            icon={L.divIcon({
              html: '<div class="start-marker"></div>',
              className: 'custom-div-icon',
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            })}
          >
            <Popup>Start Point</Popup>
          </Marker>
          
          <Marker
            position={[end.lat, end.lng]}
            icon={L.divIcon({
              html: '<div class="end-marker"></div>',
              className: 'custom-div-icon',
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            })}
          >
            <Popup>Destination</Popup>
          </Marker>
          
          {position && (
            <Marker
              position={[position.lat, position.lng]}
              icon={L.divIcon({
                html: '<div class="user-marker"></div>',
                className: 'custom-div-icon',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })}
            >
              <Popup>Your Location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Current Position Indicator */}
      {position && (
        <div className="position-indicator">
          <FaLocationArrow className="position-icon" />
          <span>{speed > 0 ? `${speed} km/h` : '0 km/h'}</span>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="navigation-controls">
        <div className="eta-display">
          <div className="eta-value">{eta} min</div>
          <div className="eta-label">ETA</div>
        </div>
        
        <div className="distance-display">
          <div className="distance-value">
            {(distanceRemaining / 1000).toFixed(1)} km
          </div>
          <div className="distance-label">to destination</div>
        </div>
        
        {!tracking ? (
          <button className="start-btn" onClick={startTracking}>
            <div className="pulse-effect"></div>
            Start Navigation
          </button>
        ) : (
          <button className="stop-btn" onClick={stopTracking}>
            End Navigation
          </button>
        )}
      </div>

      {/* Next Instruction Panel */}
      <div className="instruction-panel">
        <div className="instruction-content">
          <div className="instruction-text">
            {instructionsRef.current[currentStep]?.instruction || "Ready to navigate"}
          </div>
          <div className="step-indicator">
            Step {currentStep + 1} of {instructionsRef.current.length}
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {inHighRiskZone && (
        <div className="warning-banner">
          <div className="warning-icon">⚠️</div>
          <div className="warning-text">You are entering a high risk area. Stay alert.</div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${(currentStep / (routePointsRef.current.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StartNavigation;