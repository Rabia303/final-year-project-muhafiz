import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import Papa from 'papaparse';
import HeatmapLayer from '../components/HeatmapLayer';
import '../HeatMap.css';

const HeatMapPage = () => {
  const [rawData, setRawData] = useState([]);
  const [heatData, setHeatData] = useState([]);
  const [mode, setMode] = useState('zone'); // zone or severity
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [selectedCrime, setSelectedCrime] = useState('All');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalIncidents, setTotalIncidents] = useState(0);

  const zoneWeights = {
    Red: 1.0,
    Orange: 0.75,
    Yellow: 0.5,
    Green: 0.25,
    White: 0.1
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('karachi_crime_dataset.csv');
        const csv = await response.text();

        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (result) => {
            const parsed = result.data
              .filter(row => row.LATITUDE && row.LONGITUDE)
              .map(row => ({
                ...row,
                DATE: new Date(row.DATE)
              }));

            setRawData(parsed);
            setTotalIncidents(parsed.length);

            const types = ['All', ...new Set(parsed.map(d => d.CRIME_TYPE))];
            setCrimeTypes(types);
            setLoading(false);
          },
          error: (err) => {
            setError('Error parsing CSV data');
            setLoading(false);
          }
        });
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (rawData.length === 0) return;

    let filtered = [...rawData];

    if (selectedCrime !== 'All') {
      filtered = filtered.filter(row => row.CRIME_TYPE === selectedCrime);
    }

    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      filtered = filtered.filter(row => {
        const rowDate = new Date(row.DATE);
        return rowDate >= fromDate && rowDate <= toDate;
      });
    }

    const points = filtered.map(row => {
      const intensity = mode === 'zone'
        ? (zoneWeights[row.RISK_ZONE] || 0.1)
        : Math.min(1, row.SEVERITY_SCORE / 10);

      return [row.LATITUDE, row.LONGITUDE, intensity];
    });

    setHeatData(points);
  }, [rawData, mode, selectedCrime, dateRange]);

  const resetFilters = () => {
    setSelectedCrime('All');
    setDateRange({ from: '', to: '' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading crime data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>{error}</h3>
        <p>Please try again later</p>
      </div>
    );
  }

  return (
    <div className="heatmap-container">
      <div className="heatmap-controls">
        <div className="header-card">
          <h2>🔥 Karachi Crime Heatmap</h2>
          <p className="subtitle">Visualize crime patterns across the city</p>

          <div className="stats-card" style={{ display: 'flex', flexDirection: 'column',marginRight: '1px' }}>
            <div className="stat-item">
              <span style={{ color: 'white' }} className="stat-label">Total Incidents</span>
              <span style={{ color: 'white' }} className="stat-value">{totalIncidents.toLocaleString()}</span>
            </div>

            <div className="stat-item">
              <span style={{ color: 'white' }} className="stat-label">Displayed</span>
              <span style={{ color: 'white' }} className="stat-value highlight">{heatData.length.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="filter-card">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Crime Type</label>
            <div className="select-wrapper">
              <select
                value={selectedCrime}
                onChange={e => setSelectedCrime(e.target.value)}
                className="styled-select"
              >
                {crimeTypes.map(type =>
                  <option key={type} value={type}>{type}</option>
                )}
              </select>
            </div>
          </div>

          <div className="filter-group date-range">
            <label>Date Range</label>
            <div className="date-inputs">
              <input
                type="date"
                value={dateRange.from}
                onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Heatmap Mode</label>
            <div className="mode-toggle">
              <button
                className={`toggle-btn ${mode === 'zone' ? 'active' : ''}`}
                onClick={() => setMode('zone')}
              >
                Zone-Based
              </button>
              <button
                className={`toggle-btn ${mode === 'severity' ? 'active' : ''}`}
                onClick={() => setMode('severity')}
              >
                Severity-Based
              </button>
            </div>
          </div>

          <div className="filter-actions">
            <button className="reset-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        <div className="legend-card">
          <h3>Risk Zone Legend</h3>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color red"></span>
              <span>Red Zone (High Risk)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color orange"></span>
              <span>Orange Zone</span>
            </div>
            <div className="legend-item">
              <span className="legend-color yellow"></span>
              <span>Yellow Zone</span>
            </div>
            <div className="legend-item">
              <span className="legend-color green"></span>
              <span>Green Zone</span>
            </div>
            <div className="legend-item">
              <span className="legend-color white"></span>
              <span>White Zone (Low Risk)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={[24.8607, 67.0011]}
          zoom={12}
          scrollWheelZoom
          className="crime-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <HeatmapLayer data={heatData} mode={mode} />
        </MapContainer>
      </div>
    </div>
  );
};

export default HeatMapPage;