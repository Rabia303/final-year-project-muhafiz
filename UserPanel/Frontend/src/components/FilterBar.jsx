import React, { useState } from 'react';
import { FiFilter, FiMapPin, FiAlertTriangle } from 'react-icons/fi';

export default function FilterBar() {
  const [activeFilters, setActiveFilters] = useState([]);
  
  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <FiFilter />
        <h3>Filter Reports</h3>
      </div>
      
      <div className="filter-options">
        <div className="filter-group">
          <h4>Location</h4>
          <div className="filter-tags">
            <button 
              className={`filter-tag ${activeFilters.includes('lyari') ? 'active' : ''}`}
              onClick={() => toggleFilter('lyari')}
            >
              <FiMapPin /> Lyari
            </button>
            <button 
              className={`filter-tag ${activeFilters.includes('saddar') ? 'active' : ''}`}
              onClick={() => toggleFilter('saddar')}
            >
              <FiMapPin /> Saddar
            </button>
            <button 
              className={`filter-tag ${activeFilters.includes('korangi') ? 'active' : ''}`}
              onClick={() => toggleFilter('korangi')}
            >
              <FiMapPin /> Korangi
            </button>
          </div>
        </div>
        
        <div className="filter-group">
          <h4>Incident Type</h4>
          <div className="filter-tags">
            <button 
              className={`filter-tag ${activeFilters.includes('suspicious') ? 'active' : ''}`}
              onClick={() => toggleFilter('suspicious')}
            >
              <FiAlertTriangle /> Suspicious Activity
            </button>
            <button 
              className={`filter-tag ${activeFilters.includes('crime') ? 'active' : ''}`}
              onClick={() => toggleFilter('crime')}
            >
              <FiAlertTriangle /> Crime Reports
            </button>
            <button 
              className={`filter-tag ${activeFilters.includes('vehicle') ? 'active' : ''}`}
              onClick={() => toggleFilter('vehicle')}
            >
              <FiAlertTriangle /> Suspicious Vehicles
            </button>
          </div>
        </div>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="active-filters">
          <span>Active filters:</span>
          {activeFilters.map(filter => (
            <span key={filter} className="active-filter">
              {filter}
              <button onClick={() => toggleFilter(filter)}>×</button>
            </span>
          ))}
          <button 
            className="clear-filters"
            onClick={() => setActiveFilters([])}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}