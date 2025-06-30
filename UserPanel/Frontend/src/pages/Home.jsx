import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiMapPin, FiNavigation, FiShield, FiUsers, 
  FiBell, FiMenu, FiAlertCircle, FiMap, FiMic, FiEye,
  FiArrowLeft
} from 'react-icons/fi';
import { FaLocationArrow } from 'react-icons/fa'; 
import '../Home.css'; 
const StartNavigation = ({ routeData }) => {
  const totalDistanceRef = useRef(0);
  const [hasDeparted, setHasDeparted] = useState(false);
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
  
  const navigate = useNavigate();
  
  // Initialize route data
  useEffect(() => {
        if (routeData) {
      routePointsRef.current = routeData.route.map((pt, i) => ({
        lat: pt[0],
        lng: pt[1],
        id: i
      }));
      
      // Calculate total distance
      let totalDistance = 0;
      for (let i = 0; i < routeData.route.length - 1; i++) {
        totalDistance += haversineDistance(
          routeData.route[i][0], routeData.route[i][1],
          routeData.route[i+1][0], routeData.route[i+1][1]
        );
      }
      totalDistanceRef.current = totalDistance;
      setDistanceRemaining(totalDistance);
      setEta(Math.round(totalDistance / 1.4)); // in minutes (1.4 m/s ≈ 5 km/h)
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [routeData]);

  // Haversine distance calculation
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

  // Generate instructions for each segment
  const generateInstructions = () => {
    if (!routePointsRef.current.length) return [];
    
    const instructions = [];
    
    for (let i = 0; i < routePointsRef.current.length - 1; i++) {
      const instruction = `Continue for ${Math.round(haversineDistance(
        routePointsRef.current[i].lat, routePointsRef.current[i].lng,
        routePointsRef.current[i+1].lat, routePointsRef.current[i+1].lng
      ))} meters`;
      
      instructions.push({
        ...routePointsRef.current[i+1],
        instruction
      });
    }
    
    // Add final destination instruction
    instructions.push({
      ...routePointsRef.current[routePointsRef.current.length - 1],
      instruction: "You have arrived at your destination"
    });
    
    return instructions;
  };

  const startTracking = () => {
    if (tracking) return;
    
    instructionsRef.current = generateInstructions();
    
    setTracking(true);
    setArrived(false);
    setCurrentStep(0);
    if (voiceGuidance) speak("Navigation started. Follow the highlighted route.");

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp
        };
        
        // Calculate speed
        if (prevPositionRef.current) {
          const dist = haversineDistance(
            prevPositionRef.current.lat, prevPositionRef.current.lng,
            coords.lat, coords.lng
          );
          const timeDiff = (coords.timestamp - prevPositionRef.current.timestamp) / 1000;
          if (timeDiff > 0) {
            setSpeed(Math.round((dist / timeDiff) * 3.6)); // m/s to km/h
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
    
    // Start ETA timer
    timerRef.current = setInterval(() => {
      setEta(prev => Math.max(0, prev - 1));
    }, 60000);
    
    return () => navigator.geolocation.clearWatch(watchId);
  };

  const stopTracking = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (voiceGuidance) speak("Navigation stopped.");
    setTracking(false);
    navigate('/');
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const updateNavigation = (userPos) => {
    // Check if user has departed from start location
    if (!hasDeparted) {
      const distFromStart = haversineDistance(
        userPos.lat, userPos.lng,
        routeData.start.lat, routeData.start.lng
      );
      
      if (distFromStart > 50) {
        setHasDeparted(true);
      } else {
        // Still at start, don't progress
        return;
      }
    }

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
    
    // Only update if we've moved significantly
    if (closestIndex > currentStep && minDist < 100) {
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
    
    // Calculate actual progress
    const traveled = totalDistanceRef.current - distanceRemaining;
    const progressPercent = (traveled / totalDistanceRef.current) * 100;
    
    // Only check for arrival when near the end
    if (progressPercent > 95) {
      const destDist = haversineDistance(
        userPos.lat, userPos.lng,
        routeData.end.lat, routeData.end.lng
      );
      
      if (destDist < 50 && !arrived) {
        setArrived(true);
        if (voiceGuidance) speak("You have arrived at your destination");
        setTimeout(stopTracking, 3000);
      }
    }
  };
  // Toggle voice guidance
  const toggleVoiceGuidance = () => {
    setVoiceGuidance(!voiceGuidance);
  };

  return (
    <div className="navigation-container">
      {/* Top Navigation Bar */}
      <div className="nav-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <FiArrowLeft />
        </button>
        <div className="route-info">
          <div className="route-type" style={{ 
            backgroundColor: 
              routeData.type === 'safest' ? '#3b82f6' : 
              routeData.type === 'fastest' ? '#10b981' : '#f59e0b'
          }}>
            {routeData.type.charAt(0).toUpperCase() + routeData.type.slice(1)}
          </div>
          <div className="safety-indicator">
            <div className="safety-gauge" style={{ 
              backgroundColor: 
                routeData.safety_score >= 90 ? '#10B981' : 
                routeData.safety_score >= 70 ? '#22C55E' : 
                routeData.safety_score >= 50 ? '#F59E0B' : 
                routeData.safety_score >= 30 ? '#EF4444' : '#B91C1C'
            }}>
              <span>{routeData.safety_score}%</span>
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
        {/* In a real app, this would be a Leaflet map */}
        <div className="map-placeholder">
          <div className="map-overlay">
            <div className="route-line"></div>
            <div className="start-marker"></div>
            <div className="end-marker"></div>
            <div className="user-marker"></div>
          </div>
        </div>
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

export default function Home() {
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  // Fetch location suggestions
  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=PK&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Debounced suggestion fetcher
  const handleInputChange = (value, type) => {
    if (type === 'start') {
      setStartPoint(value);
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(value, setStartSuggestions);
      }, 300);
    } else {
      setDestination(value);
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(value, setEndSuggestions);
      }, 300);
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion, type) => {
    if (type === 'start') {
      setStartPoint(suggestion.display_name);
      setStartSuggestions([]);
    } else {
      setDestination(suggestion.display_name);
      setEndSuggestions([]);
    }
  };

  // Simulate route finding
  const findRoute = () => {
    // In a real app, this would call an API
    const mockRoute = {
      route: [[24.8607, 67.0011], [24.8610, 67.0015], [24.8615, 67.0020], [24.8934, 67.0280]],
      start: { lat: 24.8607, lng: 67.0011 },
      end: { lat: 24.8934, lng: 67.0280 },
      type: 'safest',
      zone_summary: { RED: 2, ORANGE: 3, YELLOW: 5, GREEN: 10 },
      safety_score: 85
    };
    
    setRouteData(mockRoute);
  };

  // Use current location
  const useCurrentLocation = (type) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (type === 'start') {
            setStartPoint("Current Location");
          } else {
            setDestination("Current Location");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  if (routeData) {
    return <StartNavigation routeData={routeData} />;
  }

  // // Simulate route finding
  // const findRoute = () => {
  //   // In a real app, this would call an API
  //   const mockRoute = {
  //     route: [[24.8607, 67.0011], [24.8610, 67.0015], [24.8615, 67.0020], [24.8934, 67.0280]],
  //     start: { lat: 24.8607, lng: 67.0011 },
  //     end: { lat: 24.8934, lng: 67.0280 },
  //     type: 'safest',
  //     zone_summary: { RED: 2, ORANGE: 3, YELLOW: 5, GREEN: 10 },
  //     safety_score: 85
  //   };
    
  //   setRouteData(mockRoute);
  // };

  // if (routeData) {
  //   return <StartNavigation routeData={routeData} />;
  // }

  return (
     <div className="muhafiz-app">
      {/* Luxury Hero Section with Form */}
      <section className="hero-section">
        <div className="hero-gradient-overlay"></div>
        
        <div className="hero-container">
          <div className="hero-content">
            <h1 style={{marginTop:'50px'}}>
              <span className="hero-highlight">Navigate Safely</span> with 
              <br />Community-Driven <span className="hero-highlight">Intelligence</span>
            </h1>
            <p className="hero-subtitle">
              Muhafiz empowers women with AI-powered safe routes, real-time alerts, and a supportive community network.
            </p>
            
            {/* Premium Route Form */}
            <div className="route-form-glass">
              <div className="form-header">
                <FiMapPin className="form-icon" />
                <h3>Plan Your Safe Route</h3>
              </div>
              
              <div className="form-group">
                <label style={{color:'white'}}>Starting Point</label>
                <div className="input-with-icon">
                  <FiNavigation />
                  <input 
                    type="text" 
                    placeholder="Enter your location"
                    value={startPoint}
                    onChange={(e) => handleInputChange(e.target.value, 'start')}
                  />
                </div>
                {startSuggestions.length > 0 && (
                  <div className="suggestions-box">
                    {startSuggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="suggestion-item" style={{color:'white', backgroundColor:'#1E1A2F'}}
                        onClick={() => selectSuggestion(suggestion, 'start')}
                      >
                        {suggestion.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label style={{color:'white'}}>Destination</label>
                <div className="input-with-icon">
                  <FiMapPin />
                  <input 
                    type="text" 
                    placeholder="Where to?"
                    value={destination}
                    onChange={(e) => handleInputChange(e.target.value, 'end')}
                  />
                </div>
                {endSuggestions.length > 0 && (
                  <div className="suggestions-box">
                    {endSuggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="suggestion-item" style={{color:'white', backgroundColor:'#1E1A2F'}}
                        onClick={() => selectSuggestion(suggestion, 'end')}
                      >
                        {suggestion.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button className="form-cta" onClick={findRoute}>
                <FiShield /> Find Safest Route
              </button>

              <div className="location-buttons">
                <button 
                  className="current-location-btn"
                  onClick={() => useCurrentLocation('start')}
                >
                  <FiMapPin /> Use Current Location for Start
                </button>
                <button 
                  className="current-location-btn"
                  onClick={() => useCurrentLocation('end')}
                >
                  <FiMapPin /> Use Current Location for End
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Original Features Merged Below ===== */}

      {/* Live Safety Alert */}
      <section className="alert-section" id="alerts">
        <div className="section-container">
          <h2 className="section-title">
            <FiAlertCircle /> Live Safety Updates
          </h2>
          
          <div className="alert-card-glass">
            <div className="alert-item">
              <div className="alert-icon">⚠️</div>
              <div>
                <h3 style={{color:'white'}}>Poor street lighting making the area unsafe after dark</h3>
                <p className="alert-location" style={{color:'white'}}>Joint Town, Q Block • 0.2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="features-section" id="features">
        <div className="section-container">
          <h2 className="section-title">Key Features</h2>
          <p className="section-subtitle">
            Essential tools to help women navigate safely and support each other
          </p>
          
          <div className="features-grid">
            {/* SafeRoute */}
            <div className="feature-card-glass">
              <div className="feature-icon"><FiNavigation /></div>
              <h3>SafeRoute</h3>
              <p>AI-powered navigation that prioritizes safety with routes avoiding high-risk areas.</p>
              <button className="feature-btn">Plan Your Route →</button>
            </div>

            {/* Red Zone Mapping */}
            <div className="feature-card-glass">
              <div className="feature-icon"><FiMap /></div>
              <h3>Red Zone Mapping</h3>
              <p>Real-time visualization of safety risks with color-coded community reports.</p>
              <button className="feature-btn">View Safety Map →</button>
            </div>

            {/* Incident Reporting */}
            <div className="feature-card-glass">
              <div className="feature-icon"><FiMic /></div>
              <h3>Incident Reporting</h3>
              <p>Report and document incidents to help others and improve community safety.</p>
              <button className="feature-btn">Report Incident →</button>
            </div>

            {/* Guardian Monitoring */}
            <div className="feature-card-glass">
              <div className="feature-icon"><FiEye /></div>
              <h3>Guardian Monitoring</h3>
              <p>Share live location with trusted contacts for added journey security.</p>
              <button className="feature-btn">Set Up Guardian →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Muhafiz */}
      <section className="benefits-section">
        <div className="section-container">
          <h2 className="section-title" style={{color:'white'}}>Why Choose Muhafiz?</h2>
          <p className="section-subtitle" style={{color:'white'}} >
            Designed for your safety and peace of mind
          </p>
          
          <div className="benefits-grid">
            <div className="benefit-card-glass">
              <div className="benefit-icon">⚡</div>
              <h3 style={{color:'white'}}>Real-time Updates</h3>
              <p style={{color:'white'}}>Instant notifications about safety concerns as they happen.</p>
            </div>
            
            <div className="benefit-card-glass">
              <div className="benefit-icon">👥</div>
              <h3 style={{color:'white'}}>Community-Driven</h3>
              <p style={{color:'white'}}>Collective intelligence from thousands of women.</p>
            </div>

            <div className="benefit-card-glass">
              <div className="benefit-icon">🔒</div>
              <h3 style={{color:'white'}}>Privacy Focused</h3>
              <p style={{color:'white'}}>Industry-leading security for your personal information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="community-section" id="community">
        <div className="section-container">
          <h2 className="section-title">Join the Muhafiz Community</h2>
          <p className="para">
            Download the app to access all safety features
          </p>
          <div className="cta-buttons">
            <button className="cta-primary">
              <FiShield /> Download App
            </button>
            <button className="cta-secondary">
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}