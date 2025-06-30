// import { useState, useEffect } from 'react';
// import Card from '../components/Card';
// import '../styles/heatmaps.css';

// const Heatmap = ({ data, gridLabels }) => {
//   const maxValue = Math.max(...data.map(item => item.value), 1);

//   return (
//     <div className="heatmap-container">
//       {gridLabels && (
//         <div className="heatmap-labels">
//           <div className="label-x-axis">
//             {Array.from({ length: 10 }).map((_, i) => (
//               <span key={i}>{i}</span>
//             ))}
//           </div>
//         </div>
//       )}
//       <div className="heatmap-grid">
//         {Array.from({ length: 10 }).map((_, row) => (
//           <div key={row} className="heatmap-row">
//             {Array.from({ length: 10 }).map((_, col) => {
//               const cell = data.find(item => item.x === col && item.y === row) || { value: 0 };
//               const intensity = (cell.value / maxValue) * 100;
//               const bgColor = `rgba(255, 0, 0, ${intensity / 100})`;

//               return (
//                 <div
//                   key={col}
//                   className="heatmap-cell"
//                   style={{
//                     backgroundColor: bgColor,
//                     border: intensity > 60 ? '1px solid #fff' : '1px solid transparent',
//                     transition: 'background-color 0.3s ease'
//                   }}
//                   title={`Grid (${col}, ${row}) — Incidents: ${cell.value}`}
//                 ></div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//       <div className="heatmap-legend">
//         <span>Low</span>
//         <div className="legend-gradient" />
//         <span>High</span>
//       </div>
//     </div>
//   );
// };

// const Heatmaps = () => {
//   const [mapType, setMapType] = useState('incidents');
//   const [timeRange, setTimeRange] = useState('week');
//   const [heatmapData, setHeatmapData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showLabels, setShowLabels] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     fetch(`http://localhost:5000/api/heatmap?type=${mapType}&range=${timeRange}`)
//       .then(res => res.json())
//       .then(data => {
//         setHeatmapData(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Failed to fetch heatmap:", err);
//         setHeatmapData([]);
//         setLoading(false);
//       });
//   }, [mapType, timeRange]);

//   return (
//     <div className="heatmaps-page">
//       <h2 className="page-title">Crime Heatmaps</h2>

//       <div className="heatmap-controls">
//         <div className="control-group">
//           <label>Map Type:</label>
//           <select value={mapType} onChange={e => setMapType(e.target.value)}>
//             <option value="incidents">Incident Density</option>
//             <option value="theft">Theft Hotspots</option>
//             <option value="burglary">Burglary Hotspots</option>
//             <option value="assault">Assault Hotspots</option>
//           </select>
//         </div>
//         <div className="control-group">
//           <label>Time Range:</label>
//           <select value={timeRange} onChange={e => setTimeRange(e.target.value)}>
//             <option value="day">Last 24 Hours</option>
//             <option value="week">Last Week</option>
//             <option value="month">Last Month</option>
//             <option value="year">Last Year</option>
//           </select>
//         </div>
//         <div className="control-group">
//           <label>
//             <input
//               type="checkbox"
//               checked={showLabels}
//               onChange={() => setShowLabels(prev => !prev)}
//             />
//             Show Grid Labels
//           </label>
//         </div>
//       </div>

//       <Card title={`${mapType.charAt(0).toUpperCase() + mapType.slice(1)} Heatmap`}>
//         {loading ? (
//           <p>Loading heatmap data...</p>
//         ) : (
//           <Heatmap data={heatmapData} gridLabels={showLabels} />
//         )}
//       </Card>

//       <div className="stats-row">
//         <Card title="Heatmap Summary">
//           <div className="heatmap-stats">
//             <div className="stat-item">
//               <h4>Total Incidents</h4>
//               <p>{heatmapData.reduce((sum, c) => sum + c.value, 0)}</p>
//             </div>
//             <div className="stat-item">
//               <h4>Peak Cell</h4>
//               <p>
//                 {heatmapData.length > 0
//                   ? `X: ${heatmapData.sort((a, b) => b.value - a.value)[0].x}, Y: ${heatmapData[0].y}`
//                   : 'N/A'}
//               </p>
//             </div>
//             <div className="stat-item">
//               <h4>Trend</h4>
//               <p className="trend up"><i className="fas fa-arrow-up"></i> 14%</p>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Heatmaps;
// import { useState, useEffect, useRef } from 'react';
// import Card from '../components/Card';
// import '../styles/heatmaps.css';

// const Heatmap = ({ data, gridLabels, onCellClick }) => {
//   const maxValue = Math.max(...data.map(item => item.value), 1);
  
//   // Enhanced color gradient - blue to red
//   const getColor = (intensity) => {
//     const r = Math.floor(255 * (intensity / 100));
//     const g = Math.floor(255 * (1 - intensity / 100));
//     const b = Math.floor(150 * (1 - intensity / 100));
//     return `rgb(${r}, ${g}, ${b})`;
//   };

//   return (
//     <div className="heatmap-container">
//       <div className="heatmap-axis-labels">
//         <div className="y-axis-labels">
//           {Array.from({ length: 10 }).map((_, i) => (
//             <span key={i} className="axis-label">{i}</span>
//           ))}
//         </div>
//       </div>
      
//       <div className="heatmap-grid">
//         {Array.from({ length: 10 }).map((_, row) => (
//           <div key={row} className="heatmap-row">
//             {Array.from({ length: 10 }).map((_, col) => {
//               const cell = data.find(item => item.x === col && item.y === row) || { value: 0 };
//               const intensity = (cell.value / maxValue) * 100;
//               const bgColor = getColor(intensity);

//               return (
//                 <div
//                   key={col}
//                   className="heatmap-cell"
//                   style={{
//                     background: `radial-gradient(circle at center, ${bgColor}, ${getColor(intensity * 0.7)})`,
//                     boxShadow: intensity > 50 ? `0 0 15px rgba(255, ${Math.floor(200 * (1 - intensity/100))}, 0, 0.5)` : 'none',
//                     transform: intensity > 50 ? 'scale(1.05)' : 'scale(1)',
//                     zIndex: Math.floor(intensity / 10)
//                   }}
//                   title={`Grid (${col}, ${row}) — Incidents: ${cell.value}`}
//                   onClick={() => onCellClick({...cell, x: col, y: row})}
//                 >
//                   <div className="cell-inner">
//                     {intensity > 15 && (
//                       <span className="cell-value">{cell.value}</span>
//                     )}
//                     {intensity > 70 && (
//                       <div className="pulse-animation"></div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
      
//       <div className="x-axis-labels">
//         {Array.from({ length: 10 }).map((_, i) => (
//           <span key={i} className="axis-label">{i}</span>
//         ))}
//       </div>
      
//       <div className="heatmap-legend">
//         <div className="legend-gradient">
//           {Array.from({ length: 10 }).map((_, i) => (
//             <div 
//               key={i} 
//               className="gradient-step" 
//               style={{ backgroundColor: getColor(i * 10) }}
//             />
//           ))}
//         </div>
//         <div className="legend-labels">
//           <span>Low</span>
//           <span>Medium</span>
//           <span>High</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Heatmaps = () => {
//   const [mapType, setMapType] = useState('incidents');
//   const [timeRange, setTimeRange] = useState('week');
//   const [heatmapData, setHeatmapData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCell, setSelectedCell] = useState(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     peakCell: null,
//     trend: 0,
//     comparison: {}
//   });
  
//   // Simulated crime type data for comparison chart
//   const crimeTypes = [
//     { id: 'theft', name: 'Theft', value: 142, color: '#4CAF50' },
//     { id: 'burglary', name: 'Burglary', value: 87, color: '#2196F3' },
//     { id: 'assault', name: 'Assault', value: 63, color: '#F44336' },
//     { id: 'vandalism', name: 'Vandalism', value: 45, color: '#FFC107' },
//     { id: 'robbery', name: 'Robbery', value: 38, color: '#9C27B0' }
//   ];

//   useEffect(() => {
//     setLoading(true);
    
//     // Simulate API call with timeout
//     setTimeout(() => {
//       // Generate more realistic heatmap data
//       const generateData = () => {
//         const data = [];
//         const hotspots = [
//           { x: 3, y: 2, intensity: 0.9 },
//           { x: 7, y: 5, intensity: 0.8 },
//           { x: 2, y: 7, intensity: 0.7 },
//           { x: 5, y: 3, intensity: 0.6 }
//         ];
        
//         for (let x = 0; x < 10; x++) {
//           for (let y = 0; y < 10; y++) {
//             let value = Math.floor(Math.random() * 20);
            
//             // Enhance hotspots
//             hotspots.forEach(hotspot => {
//               const distance = Math.sqrt(Math.pow(x - hotspot.x, 2) + Math.pow(y - hotspot.y, 2));
//               if (distance < 3) {
//                 value += Math.floor((3 - distance) * hotspot.intensity * 50);
//               }
//             });
            
//             data.push({ x, y, value });
//           }
//         }
        
//         return data;
//       };
      
//       const data = generateData();
//       setHeatmapData(data);
      
//       // Calculate stats
//       const total = data.reduce((sum, c) => sum + c.value, 0);
//       const peakCell = data.reduce((max, cell) => cell.value > max.value ? cell : max, data[0]);
//       const trend = Math.floor(Math.random() * 41) - 20; // -20% to +20%
      
//       setStats({
//         total,
//         peakCell,
//         trend,
//         comparison: {
//           theft: Math.floor(Math.random() * 100) + 50,
//           burglary: Math.floor(Math.random() * 80) + 30,
//           assault: Math.floor(Math.random() * 70) + 20
//         }
//       });
      
//       setLoading(false);
//     }, 1200);
//   }, [mapType, timeRange]);

//   const handleCellClick = (cell) => {
//     setSelectedCell(cell);
//   };

//   const handleTimeRangeChange = (range) => {
//     setTimeRange(range);
//   };

//   const handleMapTypeChange = (type) => {
//     setMapType(type);
//   };

//   // Calculate max value for comparison chart
//   const maxComparisonValue = Math.max(...crimeTypes.map(t => t.value), 100);

//   return (
//     <div className="heatmaps-page">
//       <div className="dashboard-header">
//         <div className="header-content">
//           <h1>Crime Heatmap Analytics</h1>
//           <p>Visualize crime patterns and hotspots across the city</p>
//         </div>
//         <div className="header-actions">
//           <div className="date-filter">
//             <select>
//               <option>Last 24 Hours</option>
//               <option>Last Week</option>
//               <option>Last Month</option>
//               <option selected>Last Year</option>
//             </select>
//           </div>
//           <button className="export-btn">
//             <i className="fas fa-download"></i> Export Report
//           </button>
//         </div>
//       </div>

//       <div className="dashboard-stats">
//         <div className="stat-card">
//           <div className="stat-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
//             <i className="fas fa-map-marker-alt"></i>
//           </div>
//           <div className="stat-content">
//             <h3>Total Incidents</h3>
//             <p>{stats.total}</p>
//             <div className="stat-trend up">
//               <i className="fas fa-arrow-up"></i> 12.4% from last month
//             </div>
//           </div>
//         </div>
        
//         <div className="stat-card">
//           <div className="stat-icon" style={{ backgroundColor: 'rgba(244, 67, 54, 0.2)' }}>
//             <i className="fas fa-fire"></i>
//           </div>
//           <div className="stat-content">
//             <h3>Peak Activity</h3>
//             <p>{stats.peakCell ? `Grid (${stats.peakCell.x}, ${stats.peakCell.y})` : 'N/A'}</p>
//             <div className="stat-trend down">
//               <i className="fas fa-arrow-down"></i> 8.2% from last quarter
//             </div>
//           </div>
//         </div>
        
//         <div className="stat-card">
//           <div className="stat-icon" style={{ backgroundColor: 'rgba(33, 150, 243, 0.2)' }}>
//             <i className="fas fa-clock"></i>
//           </div>
//           <div className="stat-content">
//             <h3>Avg. Response Time</h3>
//             <p>14.3 min</p>
//             <div className="stat-trend up">
//               <i className="fas fa-arrow-up"></i> 2.1 min faster
//             </div>
//           </div>
//         </div>
        
//         <div className="stat-card">
//           <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)' }}>
//             <i className="fas fa-shield-alt"></i>
//           </div>
//           <div className="stat-content">
//             <h3>Prevention Rate</h3>
//             <p>68%</p>
//             <div className="stat-trend up">
//               <i className="fas fa-arrow-up"></i> 7.5% improvement
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="dashboard-content">
//         <div className="main-content">
//           <Card 
//             title="Crime Density Heatmap"
//             className="heatmap-card"
//             actions={
//               <div className="card-actions">
//                 <div className="filter-group">
//                   <label>Time Range:</label>
//                   <div className="filter-buttons">
//                     <button 
//                       className={timeRange === 'day' ? 'active' : ''}
//                       onClick={() => handleTimeRangeChange('day')}
//                     >
//                       24H
//                     </button>
//                     <button 
//                       className={timeRange === 'week' ? 'active' : ''}
//                       onClick={() => handleTimeRangeChange('week')}
//                     >
//                       Week
//                     </button>
//                     <button 
//                       className={timeRange === 'month' ? 'active' : ''}
//                       onClick={() => handleTimeRangeChange('month')}
//                     >
//                       Month
//                     </button>
//                     <button 
//                       className={timeRange === 'year' ? 'active' : ''}
//                       onClick={() => handleTimeRangeChange('year')}
//                     >
//                       Year
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="filter-group">
//                   <label>Crime Type:</label>
//                   <select value={mapType} onChange={e => handleMapTypeChange(e.target.value)}>
//                     <option value="incidents">All Incidents</option>
//                     <option value="theft">Theft</option>
//                     <option value="burglary">Burglary</option>
//                     <option value="assault">Assault</option>
//                     <option value="vandalism">Vandalism</option>
//                   </select>
//                 </div>
//               </div>
//             }
//           >
//             {loading ? (
//               <div className="loading-overlay">
//                 <div className="spinner">
//                   <div className="double-bounce1"></div>
//                   <div className="double-bounce2"></div>
//                 </div>
//                 <p>Analyzing crime data patterns...</p>
//               </div>
//             ) : (
//               <div className="heatmap-wrapper">
//                 <Heatmap 
//                   data={heatmapData} 
//                   gridLabels={true} 
//                   onCellClick={handleCellClick}
//                 />
//                 <div className="heatmap-insights">
//                   <h4>Key Insights:</h4>
//                   <ul>
//                     <li>Highest concentration in central business district (Grids 3-5, 2-4)</li>
//                     <li>15% increase in residential burglaries during evening hours</li>
//                     <li>New hotspot emerging in northern industrial zone</li>
//                   </ul>
//                 </div>
//               </div>
//             )}
//           </Card>
          
//           <div className="comparison-section">
//             <Card title="Crime Type Distribution">
//               <div className="crime-comparison">
//                 {crimeTypes.map(type => (
//                   <div key={type.id} className="crime-type">
//                     <div className="type-header">
//                       <div className="type-color" style={{ backgroundColor: type.color }}></div>
//                       <span className="type-name">{type.name}</span>
//                       <span className="type-value">{type.value} incidents</span>
//                     </div>
//                     <div className="type-bar">
//                       <div 
//                         className="bar-fill" 
//                         style={{ 
//                           width: `${(type.value / maxComparisonValue) * 100}%`,
//                           backgroundColor: type.color
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </Card>
            
//             <Card title="Temporal Patterns">
//               <div className="temporal-chart">
//                 <div className="time-labels">
//                   <span>12AM</span>
//                   <span>6AM</span>
//                   <span>12PM</span>
//                   <span>6PM</span>
//                   <span>12AM</span>
//                 </div>
//                 <div className="chart-area">
//                   <div className="chart-line" style={{ height: '30%' }}></div>
//                   <div className="chart-line" style={{ height: '50%' }}></div>
//                   <div className="chart-line" style={{ height: '70%' }}></div>
//                   <div className="chart-line" style={{ height: '90%' }}></div>
                  
//                   <div className="data-points">
//                     <div className="data-point" style={{ left: '0%', height: '25%' }}></div>
//                     <div className="data-point" style={{ left: '10%', height: '18%' }}></div>
//                     <div className="data-point" style={{ left: '20%', height: '12%' }}></div>
//                     <div className="data-point" style={{ left: '30%', height: '8%' }}></div>
//                     <div className="data-point" style={{ left: '40%', height: '15%' }}></div>
//                     <div className="data-point" style={{ left: '50%', height: '45%' }}></div>
//                     <div className="data-point" style={{ left: '60%', height: '68%' }}></div>
//                     <div className="data-point" style={{ left: '70%', height: '82%' }}></div>
//                     <div className="data-point" style={{ left: '80%', height: '75%' }}></div>
//                     <div className="data-point" style={{ left: '90%', height: '60%' }}></div>
//                     <div className="data-point" style={{ left: '100%', height: '40%' }}></div>
                    
//                     <div className="data-line"></div>
//                   </div>
//                 </div>
//                 <div className="chart-title">Incidents by Time of Day</div>
//               </div>
//             </Card>
//           </div>
//         </div>
        
//         <div className="sidebar">
//           {selectedCell ? (
//             <Card title="Grid Cell Analysis" className="cell-details">
//               <div className="cell-header">
//                 <h3>Grid ({selectedCell.x}, {selectedCell.y})</h3>
//                 <div className="incident-count">{selectedCell.value} incidents</div>
//               </div>
              
//               <div className="location-details">
//                 <div className="location-icon">
//                   <i className="fas fa-map-marker-alt"></i>
//                 </div>
//                 <div className="location-info">
//                   <h4>Downtown District</h4>
//                   <p>Main Street Corridor, Zone 3</p>
//                 </div>
//               </div>
              
//               <div className="crime-breakdown">
//                 <h4>Crime Distribution</h4>
//                 <div className="breakdown-bars">
//                   <div className="breakdown-bar">
//                     <div className="bar-label">Theft</div>
//                     <div className="bar-container">
//                       <div className="bar-fill" style={{ width: '65%', backgroundColor: '#4CAF50' }}></div>
//                       <span className="bar-value">65%</span>
//                     </div>
//                   </div>
//                   <div className="breakdown-bar">
//                     <div className="bar-label">Burglary</div>
//                     <div className="bar-container">
//                       <div className="bar-fill" style={{ width: '20%', backgroundColor: '#2196F3' }}></div>
//                       <span className="bar-value">20%</span>
//                     </div>
//                   </div>
//                   <div className="breakdown-bar">
//                     <div className="bar-label">Assault</div>
//                     <div className="bar-container">
//                       <div className="bar-fill" style={{ width: '10%', backgroundColor: '#F44336' }}></div>
//                       <span className="bar-value">10%</span>
//                     </div>
//                   </div>
//                   <div className="breakdown-bar">
//                     <div className="bar-label">Other</div>
//                     <div className="bar-container">
//                       <div className="bar-fill" style={{ width: '5%', backgroundColor: '#9C27B0' }}></div>
//                       <span className="bar-value">5%</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="time-analysis">
//                 <h4>Peak Activity Times</h4>
//                 <div className="time-slots">
//                   <div className="time-slot">
//                     <div className="time-label">Morning</div>
//                     <div className="time-value">15%</div>
//                   </div>
//                   <div className="time-slot">
//                     <div className="time-label">Afternoon</div>
//                     <div className="time-value">35%</div>
//                   </div>
//                   <div className="time-slot highlight">
//                     <div className="time-label">Evening</div>
//                     <div className="time-value">45%</div>
//                   </div>
//                   <div className="time-slot">
//                     <div className="time-label">Night</div>
//                     <div className="time-value">25%</div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="action-buttons">
//                 <button className="btn-secondary">
//                   <i className="fas fa-download"></i> Export Data
//                 </button>
//                 <button className="btn-primary">
//                   <i className="fas fa-chart-line"></i> View Trends
//                 </button>
//               </div>
//             </Card>
//           ) : (
//             <Card title="Analytics Insights" className="insights-card">
//               <div className="insights-content">
//                 <div className="insight-item">
//                   <div className="insight-icon">
//                     <i className="fas fa-arrow-trend-up"></i>
//                   </div>
//                   <div className="insight-text">
//                     <h4>Rising Trend in Theft</h4>
//                     <p>12% increase in reported theft incidents compared to last month, particularly in commercial zones.</p>
//                   </div>
//                 </div>
                
//                 <div className="insight-item">
//                   <div className="insight-icon">
//                     <i className="fas fa-location-dot"></i>
//                   </div>
//                   <div className="insight-text">
//                     <h4>New Hotspot Identified</h4>
//                     <p>Grid (7,5) showing 40% increase in burglary incidents in the last two weeks.</p>
//                   </div>
//                 </div>
                
//                 <div className="insight-item">
//                   <div className="insight-icon">
//                     <i className="fas fa-clock"></i>
//                   </div>
//                   <div className="insight-text">
//                     <h4>Peak Activity Shifting</h4>
//                     <p>Assault incidents now peaking between 8-10 PM instead of 10 PM-12 AM.</p>
//                   </div>
//                 </div>
                
//                 <div className="insight-item">
//                   <div className="insight-icon">
//                     <i className="fas fa-thumbs-up"></i>
//                   </div>
//                   <div className="insight-text">
//                     <h4>Positive Trend in Residential Areas</h4>
//                     <p>15% decrease in burglary incidents in residential zones following increased patrols.</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="recommendation">
//                 <h4>Recommendation:</h4>
//                 <p>Increase evening patrols in Grid (3,2) to (5,4) area where 68% of theft incidents occur between 6-10 PM.</p>
//               </div>
//             </Card>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         /* Modern dark theme */
//         :root {
//           --primary: #1a1a2e;
//           --secondary: #16213e;
//           --accent: #0f3460;
//           --highlight: #e94560;
//           --card-bg: rgba(26, 29, 58, 0.7);
//           --text-light: #f0f0f0;
//           --text-muted: #b0b0b0;
//           --border: rgba(255, 255, 255, 0.1);
//           --success: #4CAF50;
//           --warning: #FFC107;
//           --danger: #F44336;
//           --info: #2196F3;
//         }
        
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//         }
        
//         .heatmaps-page {
//           background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
//           min-height: 100vh;
//           color: var(--text-light);
//           padding: 20px;
//         }
        
//         /* Dashboard Header */
//         .dashboard-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 25px;
//           padding-bottom: 15px;
//           border-bottom: 1px solid var(--border);
//         }
        
//         .header-content h1 {
//           font-size: 2.2rem;
//           margin-bottom: 5px;
//           background: linear-gradient(90deg, #ffffff, var(--info));
//           -webkit-background-clip: text;
//           background-clip: text;
//           color: transparent;
//         }
        
//         .header-content p {
//           color: var(--text-muted);
//           font-size: 1.1rem;
//         }
        
//         .header-actions {
//           display: flex;
//           gap: 15px;
//           align-items: center;
//         }
        
//         .date-filter select {
//           background: var(--card-bg);
//           border: 1px solid var(--border);
//           color: var(--text-light);
//           padding: 10px 15px;
//           border-radius: 8px;
//           font-size: 1rem;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }
        
//         .date-filter select:hover {
//           border-color: var(--info);
//         }
        
//         .export-btn {
//           background: linear-gradient(135deg, var(--accent), #0d2a52);
//           color: white;
//           border: none;
//           padding: 10px 20px;
//           border-radius: 8px;
//           font-weight: 500;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           transition: all 0.3s ease;
//         }
        
//         .export-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 15px rgba(14, 104, 255, 0.3);
//         }
        
//         /* Dashboard Stats */
//         .dashboard-stats {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 20px;
//           margin-bottom: 30px;
//         }
        
//         .stat-card {
//           background: var(--card-bg);
//           border-radius: 12px;
//           padding: 20px;
//           display: flex;
//           gap: 15px;
//           align-items: center;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//           border: 1px solid rgba(255, 255, 255, 0.05);
//         }
        
//         .stat-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
//         }
        
//         .stat-icon {
//           width: 50px;
//           height: 50px;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1.5rem;
//         }
        
//         .stat-content h3 {
//           font-size: 1rem;
//           color: var(--text-muted);
//           margin-bottom: 5px;
//         }
        
//         .stat-content p {
//           font-size: 1.8rem;
//           font-weight: 700;
//           margin-bottom: 5px;
//         }
        
//         .stat-trend {
//           font-size: 0.85rem;
//           display: flex;
//           align-items: center;
//           gap: 5px;
//         }
        
//         .stat-trend.up {
//           color: var(--success);
//         }
        
//         .stat-trend.down {
//           color: var(--danger);
//         }
        
//         /* Dashboard Content */
//         .dashboard-content {
//           display: grid;
//           grid-template-columns: 1fr 350px;
//           gap: 25px;
//         }
        
//         .main-content {
//           display: flex;
//           flex-direction: column;
//           gap: 25px;
//         }
        
//         /* Heatmap Card */
//         .heatmap-card {
//           background: var(--card-bg);
//           border-radius: 15px;
//           overflow: hidden;
//           border: 1px solid var(--border);
//           box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
//         }
        
//         .card-actions {
//           display: flex;
//           justify-content: space-between;
//           padding: 15px 25px;
//           background: rgba(15, 52, 96, 0.3);
//           border-bottom: 1px solid var(--border);
//         }
        
//         .filter-group {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//         }
        
//         .filter-group label {
//           color: var(--text-muted);
//           font-size: 0.95rem;
//         }
        
//         .filter-buttons {
//           display: flex;
//           gap: 8px;
//         }
        
//         .filter-buttons button {
//           background: transparent;
//           border: 1px solid var(--border);
//           color: var(--text-light);
//           padding: 8px 15px;
//           border-radius: 6px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           font-size: 0.9rem;
//         }
        
//         .filter-buttons button:hover, 
//         .filter-buttons button.active {
//           background: var(--accent);
//           border-color: var(--info);
//         }
        
//         .filter-group select {
//           background: var(--card-bg);
//           border: 1px solid var(--border);
//           color: var(--text-light);
//           padding: 8px 15px;
//           border-radius: 6px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           min-width: 150px;
//         }
        
//         .filter-group select:hover {
//           border-color: var(--info);
//         }
        
//         /* Loading State */
//         .loading-overlay {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           min-height: 400px;
//           gap: 20px;
//         }
        
//         .spinner {
//           width: 60px;
//           height: 60px;
//           position: relative;
//         }
        
//         .double-bounce1, .double-bounce2 {
//           width: 100%;
//           height: 100%;
//           border-radius: 50%;
//           background-color: var(--info);
//           opacity: 0.6;
//           position: absolute;
//           top: 0;
//           left: 0;
//           animation: bounce 2.0s infinite ease-in-out;
//         }
        
//         .double-bounce2 {
//           animation-delay: -1.0s;
//         }
        
//         @keyframes bounce {
//           0%, 100% { transform: scale(0.0); }
//           50% { transform: scale(1.0); }
//         }
        
//         .loading-overlay p {
//           color: var(--text-muted);
//           font-size: 1.1rem;
//         }
        
//         /* Heatmap Container */
//         .heatmap-wrapper {
//           padding: 20px;
//           display: flex;
//           gap: 30px;
//         }
        
//         .heatmap-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 10px;
//         }
        
//         .heatmap-grid {
//           display: flex;
//           flex-direction: column;
//           gap: 3px;
//         }
        
//         .heatmap-row {
//           display: flex;
//           gap: 3px;
//         }
        
//         .heatmap-cell {
//           width: 35px;
//           height: 35px;
//           border-radius: 6px;
//           position: relative;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           border: 1px solid rgba(0, 0, 0, 0.2);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           overflow: hidden;
//         }
        
//         .heatmap-cell:hover {
//           transform: scale(1.15);
//           z-index: 10;
//           box-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
//         }
        
//         .cell-inner {
//           position: relative;
//           width: 100%;
//           height: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
        
//         .cell-value {
//           font-size: 0.8rem;
//           font-weight: 700;
//           color: white;
//           text-shadow: 0 1px 2px rgba(0,0,0,0.5);
//         }
        
//         .pulse-animation {
//           position: absolute;
//           width: 100%;
//           height: 100%;
//           border-radius: 50%;
//           background: rgba(255, 255, 255, 0.3);
//           animation: pulse 1.5s infinite;
//         }
        
//         @keyframes pulse {
//           0% {
//             transform: scale(0.8);
//             opacity: 0.7;
//           }
//           70% {
//             transform: scale(1.5);
//             opacity: 0;
//           }
//           100% {
//             transform: scale(1.5);
//             opacity: 0;
//           }
//         }
        
//         .heatmap-axis-labels {
//           display: flex;
//           align-items: flex-start;
//           height: 350px;
//         }
        
//         .y-axis-labels {
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           height: 100%;
//           padding: 17px 0;
//         }
        
//         .x-axis-labels {
//           display: flex;
//           justify-content: space-between;
//           width: 350px;
//           padding: 0 17px;
//         }
        
//         .axis-label {
//           color: var(--text-muted);
//           font-size: 0.85rem;
//         }
        
//         .heatmap-legend {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           margin-top: 20px;
//           gap: 8px;
//         }
        
//         .legend-gradient {
//           display: flex;
//           width: 250px;
//           height: 12px;
//           border-radius: 6px;
//           overflow: hidden;
//         }
        
//         .gradient-step {
//           flex: 1;
//         }
        
//         .legend-labels {
//           display: flex;
//           justify-content: space-between;
//           width: 250px;
//           color: var(--text-muted);
//           font-size: 0.85rem;
//         }
        
//         .heatmap-insights {
//           background: rgba(15, 52, 96, 0.3);
//           border-radius: 10px;
//           padding: 20px;
//           flex: 1;
//           border: 1px solid var(--border);
//         }
        
//         .heatmap-insights h4 {
//           margin-bottom: 15px;
//           color: var(--highlight);
//           font-size: 1.2rem;
//         }
        
//         .heatmap-insights ul {
//           padding-left: 20px;
//         }
        
//         .heatmap-insights li {
//           margin-bottom: 10px;
//           line-height: 1.5;
//         }
        
//         /* Comparison Section */
//         .comparison-section {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 25px;
//         }
        
//         .crime-comparison {
//           display: flex;
//           flex-direction: column;
//           gap: 15px;
//           padding: 10px 0;
//         }
        
//         .crime-type {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }
        
//         .type-header {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
        
//         .type-color {
//           width: 12px;
//           height: 12px;
//           border-radius: 3px;
//         }
        
//         .type-name {
//           font-weight: 600;
//           flex: 1;
//         }
        
//         .type-value {
//           color: var(--text-muted);
//           font-size: 0.9rem;
//         }
        
//         .type-bar {
//           height: 8px;
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 4px;
//           overflow: hidden;
//         }
        
//         .bar-fill {
//           height: 100%;
//           border-radius: 4px;
//           transition: width 1s ease;
//         }
        
//         /* Temporal Chart */
//         .temporal-chart {
//           padding: 20px 10px;
//         }
        
//         .time-labels {
//           display: flex;
//           justify-content: space-between;
//           padding: 0 10px;
//           color: var(--text-muted);
//           font-size: 0.85rem;
//           margin-bottom: 10px;
//         }
        
//         .chart-area {
//           height: 200px;
//           background: rgba(15, 52, 96, 0.2);
//           border-radius: 8px;
//           position: relative;
//           padding: 15px;
//           border: 1px solid var(--border);
//         }
        
//         .chart-line {
//           border-top: 1px dashed rgba(255, 255, 255, 0.1);
//           position: absolute;
//           width: calc(100% - 30px);
//         }
        
//         .data-points {
//           position: absolute;
//           top: 0;
//           left: 15px;
//           width: calc(100% - 30px);
//           height: 100%;
//         }
        
//         .data-point {
//           position: absolute;
//           width: 8px;
//           height: 8px;
//           background: var(--highlight);
//           border-radius: 50%;
//           transform: translate(-50%, 50%);
//           bottom: 0;
//         }
        
//         .data-line {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           width: 100%;
//           height: 2px;
//           background: linear-gradient(90deg, transparent, var(--info), transparent);
//         }
        
//         .chart-title {
//           text-align: center;
//           margin-top: 10px;
//           color: var(--text-muted);
//           font-size: 0.95rem;
//         }
        
//         /* Sidebar */
//         .sidebar {
//           display: flex;
//           flex-direction: column;
//           gap: 25px;
//         }
        
//         /* Cell Details */
//         .cell-details {
//           background: var(--card-bg);
//           border-radius: 15px;
//           overflow: hidden;
//           border: 1px solid var(--border);
//         }
        
//         .cell-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 20px;
//           border-bottom: 1px solid var(--border);
//         }
        
//         .cell-header h3 {
//           font-size: 1.3rem;
//         }
        
//         .incident-count {
//           background: var(--highlight);
//           color: white;
//           padding: 5px 15px;
//           border-radius: 20px;
//           font-weight: 700;
//         }
        
//         .location-details {
//           display: flex;
//           gap: 15px;
//           padding: 20px;
//           border-bottom: 1px solid var(--border);
//         }
        
//         .location-icon {
//           width: 45px;
//           height: 45px;
//           border-radius: 12px;
//           background: rgba(33, 150, 243, 0.2);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1.2rem;
//           color: var(--info);
//         }
        
//         .location-info h4 {
//           margin-bottom: 5px;
//           font-size: 1.1rem;
//         }
        
//         .location-info p {
//           color: var(--text-muted);
//         }
        
//         .crime-breakdown {
//           padding: 20px;
//           border-bottom: 1px solid var(--border);
//         }
        
//         .crime-breakdown h4 {
//           margin-bottom: 15px;
//           color: var(--highlight);
//         }
        
//         .breakdown-bars {
//           display: flex;
//           flex-direction: column;
//           gap: 15px;
//         }
        
//         .breakdown-bar {
//           display: flex;
//           flex-direction: column;
//           gap: 5px;
//         }
        
//         .bar-label {
//           font-size: 0.95rem;
//         }
        
//         .bar-container {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
        
//         .bar-fill {
//           height: 10px;
//           border-radius: 5px;
//           transition: width 0.8s ease;
//         }
        
//         .bar-value {
//           font-size: 0.9rem;
//           color: var(--text-muted);
//         }
        
//         .time-analysis {
//           padding: 20px;
//         }
        
//         .time-analysis h4 {
//           margin-bottom: 15px;
//           color: var(--highlight);
//         }
        
//         .time-slots {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 10px;
//         }
        
//         .time-slot {
//           background: rgba(15, 52, 96, 0.3);
//           border-radius: 8px;
//           padding: 12px;
//           text-align: center;
//           transition: all 0.3s ease;
//           border: 1px solid var(--border);
//         }
        
//         .time-slot.highlight {
//           background: rgba(233, 69, 96, 0.2);
//           border-color: var(--highlight);
//           transform: translateY(-5px);
//           box-shadow: 0 5px 15px rgba(233, 69, 96, 0.2);
//         }
        
//         .time-label {
//           font-size: 0.9rem;
//           color: var(--text-muted);
//           margin-bottom: 5px;
//         }
        
//         .time-value {
//           font-size: 1.2rem;
//           font-weight: 700;
//         }
        
//         .action-buttons {
//           display: flex;
//           gap: 15px;
//           padding: 20px;
//           border-top: 1px solid var(--border);
//         }
        
//         .btn-secondary, .btn-primary {
//           flex: 1;
//           padding: 12px;
//           border-radius: 8px;
//           font-weight: 500;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//         }
        
//         .btn-secondary {
//           background: transparent;
//           border: 1px solid var(--border);
//           color: var(--text-light);
//         }
        
//         .btn-secondary:hover {
//           border-color: var(--info);
//           background: rgba(33, 150, 243, 0.1);
//         }
        
//         .btn-primary {
//           background: linear-gradient(135deg, var(--accent), #0d2a52);
//           border: none;
//           color: white;
//         }
        
//         .btn-primary:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 15px rgba(14, 104, 255, 0.3);
//         }
        
//         /* Insights Card */
//         .insights-card {
//           background: var(--card-bg);
//           border-radius: 15px;
//           overflow: hidden;
//           border: 1px solid var(--border);
//         }
        
//         .insights-content {
//           padding: 20px;
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//         }
        
//         .insight-item {
//           display: flex;
//           gap: 15px;
//         }
        
//         .insight-icon {
//           width: 40px;
//           height: 40px;
//           border-radius: 10px;
//           background: rgba(233, 69, 96, 0.2);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: var(--highlight);
//           font-size: 1.2rem;
//           flex-shrink: 0;
//         }
        
//         .insight-text h4 {
//           margin-bottom: 5px;
//           font-size: 1.1rem;
//         }
        
//         .insight-text p {
//           color: var(--text-muted);
//           font-size: 0.95rem;
//           line-height: 1.5;
//         }
        
//         .recommendation {
//           padding: 20px;
//           background: rgba(15, 52, 96, 0.3);
//           border-top: 1px solid var(--border);
//         }
        
//         .recommendation h4 {
//           color: var(--highlight);
//           margin-bottom: 10px;
//         }
        
//         .recommendation p {
//           color: var(--text-muted);
//           line-height: 1.6;
//         }
        
//         /* Responsive Design */
//         @media (max-width: 1200px) {
//           .dashboard-stats {
//             grid-template-columns: repeat(2, 1fr);
//           }
          
//           .dashboard-content {
//             grid-template-columns: 1fr;
//           }
          
//           .sidebar {
//             grid-row: 1;
//           }
          
//           .comparison-section {
//             grid-template-columns: 1fr;
//           }
//         }
        
//         @media (max-width: 768px) {
//           .dashboard-header {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 15px;
//           }
          
//           .dashboard-stats {
//             grid-template-columns: 1fr;
//           }
          
//           .heatmap-wrapper {
//             flex-direction: column;
//           }
          
//           .heatmap-insights {
//             width: 100%;
//           }
//         }
        
//         @media (max-width: 480px) {
//           .card-actions {
//             flex-direction: column;
//             gap: 15px;
//           }
          
//           .filter-group {
//             width: 100%;
//           }
          
//           .filter-buttons {
//             flex-wrap: wrap;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Heatmaps;

import { useState, useEffect } from 'react';
import Card from '../components/Card';
import '../styles/heatmaps.css';

const Heatmap = ({ data, gridLabels, onCellClick }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  // Enhanced color gradient - blue to red
  const getColor = (intensity) => {
    const r = Math.floor(255 * (intensity / 100));
    const g = Math.floor(255 * (1 - intensity / 100));
    const b = Math.floor(150 * (1 - intensity / 100));
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Calculate grid dimensions
  const cellSize = 35;
  const gap = 3;
  const gridWidth = 10 * cellSize + 9 * gap;
  const gridHeight = 10 * cellSize + 9 * gap;

  return (
    <div className="heatmap-container">
      <div className="axis-container">
        {/* Y-axis labels */}
        <div className="y-axis-labels" style={{ height: gridHeight }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="axis-label-cell">
              <span className="axis-label">{i}</span>
            </div>
          ))}
        </div>
        
        {/* Main grid */}
        <div className="grid-area">
          <div className="heatmap-grid" style={{ width: gridWidth, height: gridHeight }}>
            {Array.from({ length: 10 }).map((_, row) => (
              <div key={row} className="heatmap-row">
                {Array.from({ length: 10 }).map((_, col) => {
                  const cell = data.find(item => item.x === col && item.y === row) || { value: 0 };
                  const intensity = (cell.value / maxValue) * 100;
                  const bgColor = getColor(intensity);

                  return (
                    <div
                      key={col}
                      className="heatmap-cell"
                      style={{
                        width: cellSize,
                        height: cellSize,
                        background: `radial-gradient(circle at center, ${bgColor}, ${getColor(intensity * 0.7)})`,
                        boxShadow: intensity > 50 ? `0 0 15px rgba(255, ${Math.floor(200 * (1 - intensity/100))}, 0, 0.5)` : 'none',
                        transform: intensity > 50 ? 'scale(1.05)' : 'scale(1)',
                        zIndex: Math.floor(intensity / 10)
                      }}
                      title={`Grid (${col}, ${row}) — Incidents: ${cell.value}`}
                      onClick={() => onCellClick({...cell, x: col, y: row})}
                    >
                      <div className="cell-inner">
                        {intensity > 15 && (
                          <span className="cell-value">{cell.value}</span>
                        )}
                        {intensity > 70 && (
                          <div className="pulse-animation"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="x-axis-labels" style={{ width: gridWidth }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="axis-label-cell">
                <span className="axis-label">{i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="heatmap-legend">
        <div className="legend-gradient">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="gradient-step" 
              style={{ backgroundColor: getColor(i * 10) }}
            />
          ))}
        </div>
        <div className="legend-labels">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

const Heatmaps = () => {
  const [mapType, setMapType] = useState('incidents');
  const [timeRange, setTimeRange] = useState('week');
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    peakCell: null,
    trend: 0,
    comparison: {}
  });
  
  // Simulated crime type data for comparison chart
  const crimeTypes = [
    { id: 'theft', name: 'Theft', value: 142, color: '#4CAF50' },
    { id: 'burglary', name: 'Burglary', value: 87, color: '#2196F3' },
    { id: 'assault', name: 'Assault', value: 63, color: '#F44336' },
    { id: 'vandalism', name: 'Vandalism', value: 45, color: '#FFC107' },
    { id: 'robbery', name: 'Robbery', value: 38, color: '#9C27B0' }
  ];

  useEffect(() => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate more realistic heatmap data
      const generateData = () => {
        const data = [];
        const hotspots = [
          { x: 3, y: 2, intensity: 0.9 },
          { x: 7, y: 5, intensity: 0.8 },
          { x: 2, y: 7, intensity: 0.7 },
          { x: 5, y: 3, intensity: 0.6 }
        ];
        
        for (let x = 0; x < 10; x++) {
          for (let y = 0; y < 10; y++) {
            let value = Math.floor(Math.random() * 20);
            
            // Enhance hotspots
            hotspots.forEach(hotspot => {
              const distance = Math.sqrt(Math.pow(x - hotspot.x, 2) + Math.pow(y - hotspot.y, 2));
              if (distance < 3) {
                value += Math.floor((3 - distance) * hotspot.intensity * 50);
              }
            });
            
            data.push({ x, y, value });
          }
        }
        
        return data;
      };
      
      const data = generateData();
      setHeatmapData(data);
      
      // Calculate stats
      const total = data.reduce((sum, c) => sum + c.value, 0);
      const peakCell = data.reduce((max, cell) => cell.value > max.value ? cell : max, data[0]);
      const trend = Math.floor(Math.random() * 41) - 20; // -20% to +20%
      
      setStats({
        total,
        peakCell,
        trend,
        comparison: {
          theft: Math.floor(Math.random() * 100) + 50,
          burglary: Math.floor(Math.random() * 80) + 30,
          assault: Math.floor(Math.random() * 70) + 20
        }
      });
      
      setLoading(false);
    }, 1200);
  }, [mapType, timeRange]);

  const handleCellClick = (cell) => {
    setSelectedCell(cell);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleMapTypeChange = (type) => {
    setMapType(type);
  };

  // Calculate max value for comparison chart
  const maxComparisonValue = Math.max(...crimeTypes.map(t => t.value), 100);

  return (
    <div className="heatmaps-page">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Crime Heatmap Analytics</h1>
          <p>Visualize crime patterns and hotspots across the city</p>
        </div>
        <div className="header-actions">
          <div className="date-filter">
            <select>
              <option>Last 24 Hours</option>
              <option>Last Week</option>
              <option>Last Month</option>
              <option selected>Last Year</option>
            </select>
          </div>
          <button className="export-btn">
            <i className="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div className="stat-content">
            <h3>Total Incidents</h3>
            <p>{stats.total}</p>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i> 12.4% from last month
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(244, 67, 54, 0.2)' }}>
            <i className="fas fa-fire"></i>
          </div>
          <div className="stat-content">
            <h3>Peak Activity</h3>
            <p>{stats.peakCell ? `Grid (${stats.peakCell.x}, ${stats.peakCell.y})` : 'N/A'}</p>
            <div className="stat-trend down">
              <i className="fas fa-arrow-down"></i> 8.2% from last quarter
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(33, 150, 243, 0.2)' }}>
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>Avg. Response Time</h3>
            <p>14.3 min</p>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i> 2.1 min faster
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)' }}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="stat-content">
            <h3>Prevention Rate</h3>
            <p>68%</p>
            <div className="stat-trend up">
              <i className="fas fa-arrow-up"></i> 7.5% improvement
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <Card 
            title="Crime Density Heatmap"
            className="heatmap-card"
            actions={
              <div className="card-actions">
                <div className="filter-group">
                  <label>Time Range:</label>
                  <div className="filter-buttons">
                    <button 
                      className={timeRange === 'day' ? 'active' : ''}
                      onClick={() => handleTimeRangeChange('day')}
                    >
                      24H
                    </button>
                    <button 
                      className={timeRange === 'week' ? 'active' : ''}
                      onClick={() => handleTimeRangeChange('week')}
                    >
                      Week
                    </button>
                    <button 
                      className={timeRange === 'month' ? 'active' : ''}
                      onClick={() => handleTimeRangeChange('month')}
                    >
                      Month
                    </button>
                    <button 
                      className={timeRange === 'year' ? 'active' : ''}
                      onClick={() => handleTimeRangeChange('year')}
                    >
                      Year
                    </button>
                  </div>
                </div>
                
                <div className="filter-group">
                  <label>Crime Type:</label>
                  <select value={mapType} onChange={e => handleMapTypeChange(e.target.value)}>
                    <option value="incidents">All Incidents</option>
                    <option value="theft">Theft</option>
                    <option value="burglary">Burglary</option>
                    <option value="assault">Assault</option>
                    <option value="vandalism">Vandalism</option>
                  </select>
                </div>
              </div>
            }
          >
            {loading ? (
              <div className="loading-overlay">
                <div className="spinner">
                  <div className="double-bounce1"></div>
                  <div className="double-bounce2"></div>
                </div>
                <p>Analyzing crime data patterns...</p>
              </div>
            ) : (
              <div className="heatmap-wrapper">
                <Heatmap 
                  data={heatmapData} 
                  gridLabels={true} 
                  onCellClick={handleCellClick}
                />
                <div className="heatmap-insights">
                  <h4>Key Insights:</h4>
                  <ul>
                    <li>Highest concentration in central business district (Grids 3-5, 2-4)</li>
                    <li>15% increase in residential burglaries during evening hours</li>
                    <li>New hotspot emerging in northern industrial zone</li>
                  </ul>
                </div>
              </div>
            )}
          </Card>
          
          <div className="comparison-section">
            <Card title="Crime Type Distribution">
              <div className="crime-comparison">
                {crimeTypes.map(type => (
                  <div key={type.id} className="crime-type">
                    <div className="type-header">
                      <div className="type-color" style={{ backgroundColor: type.color }}></div>
                      <span className="type-name">{type.name}</span>
                      <span className="type-value">{type.value} incidents</span>
                    </div>
                    <div className="type-bar">
                      <div 
                        className="bar-fill" 
                        style={{ 
                          width: `${(type.value / maxComparisonValue) * 100}%`,
                          backgroundColor: type.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card title="Temporal Patterns">
              <div className="temporal-chart">
                <div className="time-labels">
                  <span>12AM</span>
                  <span>6AM</span>
                  <span>12PM</span>
                  <span>6PM</span>
                  <span>12AM</span>
                </div>
                <div className="chart-area">
                  <div className="chart-line" style={{ height: '30%' }}></div>
                  <div className="chart-line" style={{ height: '50%' }}></div>
                  <div className="chart-line" style={{ height: '70%' }}></div>
                  <div className="chart-line" style={{ height: '90%' }}></div>
                  
                  <div className="data-points">
                    <div className="data-point" style={{ left: '0%', height: '25%' }}></div>
                    <div className="data-point" style={{ left: '10%', height: '18%' }}></div>
                    <div className="data-point" style={{ left: '20%', height: '12%' }}></div>
                    <div className="data-point" style={{ left: '30%', height: '8%' }}></div>
                    <div className="data-point" style={{ left: '40%', height: '15%' }}></div>
                    <div className="data-point" style={{ left: '50%', height: '45%' }}></div>
                    <div className="data-point" style={{ left: '60%', height: '68%' }}></div>
                    <div className="data-point" style={{ left: '70%', height: '82%' }}></div>
                    <div className="data-point" style={{ left: '80%', height: '75%' }}></div>
                    <div className="data-point" style={{ left: '90%', height: '60%' }}></div>
                    <div className="data-point" style={{ left: '100%', height: '40%' }}></div>
                    
                    <div className="data-line"></div>
                  </div>
                </div>
                <div className="chart-title">Incidents by Time of Day</div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="analytics-sidebar">
          <Card title="Analytics Insights" className="insights-card">
            <div className="insights-content">
              <div className="insight-item">
                <div className="insight-icon">
                  <i className="fas fa-arrow-trend-up"></i>
                </div>
                <div className="insight-text">
                  <h4>Rising Trend in Theft</h4>
                  <p>12% increase in reported theft incidents compared to last month, particularly in commercial zones.</p>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-icon">
                  <i className="fas fa-location-dot"></i>
                </div>
                <div className="insight-text">
                  <h4>New Hotspot Identified</h4>
                  <p>Grid (7,5) showing 40% increase in burglary incidents in the last two weeks.</p>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="insight-text">
                  <h4>Peak Activity Shifting</h4>
                  <p>Assault incidents now peaking between 8-10 PM instead of 10 PM-12 AM.</p>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-icon">
                  <i className="fas fa-thumbs-up"></i>
                </div>
                <div className="insight-text">
                  <h4>Positive Trend in Residential Areas</h4>
                  <p>15% decrease in burglary incidents in residential zones following increased patrols.</p>
                </div>
              </div>
            </div>
            
            <div className="recommendation">
              <h4>Recommendation:</h4>
              <p>Increase evening patrols in Grid (3,2) to (5,4) area where 68% of theft incidents occur between 6-10 PM.</p>
            </div>
          </Card>
          
          {selectedCell && (
            <Card title="Grid Cell Analysis" className="cell-details">
              <div className="cell-header">
                <h3>Grid ({selectedCell.x}, {selectedCell.y})</h3>
                <div className="incident-count">{selectedCell.value} incidents</div>
              </div>
              
              <div className="location-details">
                <div className="location-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="location-info">
                  <h4>Downtown District</h4>
                  <p>Main Street Corridor, Zone 3</p>
                </div>
              </div>
              
              <div className="crime-breakdown">
                <h4>Crime Distribution</h4>
                <div className="breakdown-bars">
                  <div className="breakdown-bar">
                    <div className="bar-label">Theft</div>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: '65%', backgroundColor: '#4CAF50' }}></div>
                      <span className="bar-value">65%</span>
                    </div>
                  </div>
                  <div className="breakdown-bar">
                    <div className="bar-label">Burglary</div>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: '20%', backgroundColor: '#2196F3' }}></div>
                      <span className="bar-value">20%</span>
                    </div>
                  </div>
                  <div className="breakdown-bar">
                    <div className="bar-label">Assault</div>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: '10%', backgroundColor: '#F44336' }}></div>
                      <span className="bar-value">10%</span>
                    </div>
                  </div>
                  <div className="breakdown-bar">
                    <div className="bar-label">Other</div>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: '5%', backgroundColor: '#9C27B0' }}></div>
                      <span className="bar-value">5%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="time-analysis">
                <h4>Peak Activity Times</h4>
                <div className="time-slots">
                  <div className="time-slot">
                    <div className="time-label">Morning</div>
                    <div className="time-value">15%</div>
                  </div>
                  <div className="time-slot">
                    <div className="time-label">Afternoon</div>
                    <div className="time-value">35%</div>
                  </div>
                  <div className="time-slot highlight">
                    <div className="time-label">Evening</div>
                    <div className="time-value">45%</div>
                  </div>
                  <div className="time-slot">
                    <div className="time-label">Night</div>
                    <div className="time-value">25%</div>
                  </div>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="btn-secondary">
                  <i className="fas fa-download"></i> Export Data
                </button>
                <button className="btn-primary">
                  <i className="fas fa-chart-line"></i> View Trends
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Modern dark theme */
        :root {
          --primary: #1a1a2e;
          --secondary: #16213e;
          --accent: #0f3460;
          --highlight: #e94560;
          --card-bg: rgba(26, 29, 58, 0.7);
          --text-light: #f0f0f0;
          --text-muted: #b0b0b0;
          --border: rgba(255, 255, 255, 0.1);
          --success: #4CAF50;
          --warning: #FFC107;
          --danger: #F44336;
          --info: #2196F3;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .heatmaps-page {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          min-height: 100vh;
          color: var(--text-light);
          padding: 20px;
        }
        
        /* Dashboard Header */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border);
        }
        
        .header-content h1 {
          font-size: 2.2rem;
          margin-bottom: 5px;
          background: linear-gradient(90deg, #ffffff, var(--info));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .header-content p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }
        
        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        
        .date-filter select {
          background: var(--card-bg);
          border: 1px solid var(--border);
          color: var(--text-light);
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .date-filter select:hover {
          border-color: var(--info);
        }
        
        .export-btn {
          background: linear-gradient(135deg, var(--accent), #0d2a52);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .export-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(14, 104, 255, 0.3);
        }
        
        /* Dashboard Stats */
        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 15px;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .stat-content h3 {
          font-size: 1rem;
          color: var(--text-muted);
          margin-bottom: 5px;
        }
        
        .stat-content p {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .stat-trend {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .stat-trend.up {
          color: var(--success);
        }
        
        .stat-trend.down {
          color: var(--danger);
        }
        
        /* Dashboard Content */
        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 25px;
        }
        
        .main-content {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        .analytics-sidebar {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        /* Heatmap Card */
        .heatmap-card {
          background: var(--card-bg);
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid var(--border);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
        }
        
        .card-actions {
          display: flex;
          justify-content: space-between;
          padding: 15px 25px;
          background: rgba(15, 52, 96, 0.3);
          border-bottom: 1px solid var(--border);
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .filter-group label {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        
        .filter-buttons {
          display: flex;
          gap: 8px;
        }
        
        .filter-buttons button {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-light);
          padding: 8px 15px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .filter-buttons button:hover, 
        .filter-buttons button.active {
          background: var(--accent);
          border-color: var(--info);
        }
        
        .filter-group select {
          background: var(--card-bg);
          border: 1px solid var(--border);
          color: var(--text-light);
          padding: 8px 15px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 150px;
        }
        
        .filter-group select:hover {
          border-color: var(--info);
        }
        
        /* Loading State */
        .loading-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 20px;
        }
        
        .spinner {
          width: 60px;
          height: 60px;
          position: relative;
        }
        
        .double-bounce1, .double-bounce2 {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: var(--info);
          opacity: 0.6;
          position: absolute;
          top: 0;
          left: 0;
          animation: bounce 2.0s infinite ease-in-out;
        }
        
        .double-bounce2 {
          animation-delay: -1.0s;
        }
        
        @keyframes bounce {
          0%, 100% { transform: scale(0.0); }
          50% { transform: scale(1.0); }
        }
        
        .loading-overlay p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }
        
        /* Heatmap Container */
        .heatmap-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
        .axis-container {
          display: flex;
          gap: 15px;
        }
        
        .y-axis-labels {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .axis-label-cell {
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .axis-label {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        
        .grid-area {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .heatmap-grid {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        
        .heatmap-row {
          display: flex;
          gap: 3px;
        }
        
        .heatmap-cell {
          border-radius: 6px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .heatmap-cell:hover {
          transform: scale(1.15);
          z-index: 10;
          box-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
        }
        
        .cell-inner {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cell-value {
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        
        .pulse-animation {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.7;
          }
          70% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .x-axis-labels {
          display: flex;
          justify-content: space-between;
        }
        
        .heatmap-legend {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
          gap: 8px;
        }
        
        .legend-gradient {
          display: flex;
          width: 250px;
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .gradient-step {
          flex: 1;
        }
        
        .legend-labels {
          display: flex;
          justify-content: space-between;
          width: 250px;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        
        .heatmap-insights {
          background: rgba(15, 52, 96, 0.3);
          border-radius: 10px;
          padding: 20px;
          flex: 1;
          border: 1px solid var(--border);
        }
        
        .heatmap-insights h4 {
          margin-bottom: 15px;
          color: var(--highlight);
          font-size: 1.2rem;
        }
        
        .heatmap-insights ul {
          padding-left: 20px;
        }
        
        .heatmap-insights li {
          margin-bottom: 10px;
          line-height: 1.5;
        }
        
        /* Comparison Section */
        .comparison-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }
        
        .crime-comparison {
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding: 10px 0;
        }
        
        .crime-type {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .type-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .type-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }
        
        .type-name {
          font-weight: 600;
          flex: 1;
        }
        
        .type-value {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        .type-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1s ease;
        }
        
        /* Temporal Chart */
        .temporal-chart {
          padding: 20px 10px;
        }
        
        .time-labels {
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-bottom: 10px;
        }
        
        .chart-area {
          height: 200px;
          background: rgba(15, 52, 96, 0.2);
          border-radius: 8px;
          position: relative;
          padding: 15px;
          border: 1px solid var(--border);
        }
        
        .chart-line {
          border-top: 1px dashed rgba(255, 255, 255, 0.1);
          position: absolute;
          width: calc(100% - 30px);
        }
        
        .data-points {
          position: absolute;
          top: 0;
          left: 15px;
          width: calc(100% - 30px);
          height: 100%;
        }
        
        .data-point {
          position: absolute;
          width: 8px;
          height: 8px;
          background: var(--highlight);
          border-radius: 50%;
          transform: translate(-50%, 50%);
          bottom: 0;
        }
        
        .data-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--info), transparent);
        }
        
        .chart-title {
          text-align: center;
          margin-top: 10px;
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        
        /* Cell Details */
        .cell-details {
          background: var(--card-bg);
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        
        .cell-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid var(--border);
        }
        
        .cell-header h3 {
          font-size: 1.3rem;
        }
        
        .incident-count {
          background: var(--highlight);
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: 700;
        }
        
        .location-details {
          display: flex;
          gap: 15px;
          padding: 20px;
          border-bottom: 1px solid var(--border);
        }
        
        .location-icon {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          background: rgba(33, 150, 243, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: var(--info);
        }
        
        .location-info h4 {
          margin-bottom: 5px;
          font-size: 1.1rem;
        }
        
        .location-info p {
          color: var(--text-muted);
        }
        
        .crime-breakdown {
          padding: 20px;
          border-bottom: 1px solid var(--border);
        }
        
        .crime-breakdown h4 {
          margin-bottom: 15px;
          color: var(--highlight);
        }
        
        .breakdown-bars {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .breakdown-bar {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .bar-label {
          font-size: 0.95rem;
        }
        
        .bar-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .bar-fill {
          height: 10px;
          border-radius: 5px;
          transition: width 0.8s ease;
        }
        
        .bar-value {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        
        .time-analysis {
          padding: 20px;
        }
        
        .time-analysis h4 {
          margin-bottom: 15px;
          color: var(--highlight);
        }
        
        .time-slots {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        
        .time-slot {
          background: rgba(15, 52, 96, 0.3);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid var(--border);
        }
        
        .time-slot.highlight {
          background: rgba(233, 69, 96, 0.2);
          border-color: var(--highlight);
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(233, 69, 96, 0.2);
        }
        
        .time-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 5px;
        }
        
        .time-value {
          font-size: 1.2rem;
          font-weight: 700;
        }
        
        .action-buttons {
          display: flex;
          gap: 15px;
          padding: 20px;
          border-top: 1px solid var(--border);
        }
        
        .btn-secondary, .btn-primary {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .btn-secondary {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-light);
        }
        
        .btn-secondary:hover {
          border-color: var(--info);
          background: rgba(33, 150, 243, 0.1);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, var(--accent), #0d2a52);
          border: none;
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(14, 104, 255, 0.3);
        }
        
        /* Insights Card */
        .insights-card {
          background: var(--card-bg);
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        
        .insights-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .insight-item {
          display: flex;
          gap: 15px;
        }
        
        .insight-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(233, 69, 96, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--highlight);
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        
        .insight-text h4 {
          margin-bottom: 5px;
          font-size: 1.1rem;
        }
        
        .insight-text p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.5;
        }
        
        .recommendation {
          padding: 20px;
          background: rgba(15, 52, 96, 0.3);
          border-top: 1px solid var(--border);
        }
        
        .recommendation h4 {
          color: var(--highlight);
          margin-bottom: 10px;
        }
        
        .recommendation p {
          color: var(--text-muted);
          line-height: 1.6;
        }
        
        /* Responsive Design */
        @media (max-width: 1200px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .dashboard-content {
            grid-template-columns: 1fr;
          }
          
          .comparison-section {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .dashboard-stats {
            grid-template-columns: 1fr;
          }
          
          .heatmap-wrapper {
            flex-direction: column;
          }
          
          .heatmap-insights {
            width: 100%;
          }
          
          .axis-container {
            flex-direction: column;
          }
          
          .y-axis-labels {
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            height: auto !important;
          }
        }
        
        @media (max-width: 480px) {
          .card-actions {
            flex-direction: column;
            gap: 15px;
          }
          
          .filter-group {
            width: 100%;
          }
          
          .filter-buttons {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Heatmaps;