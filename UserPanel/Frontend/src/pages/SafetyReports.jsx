import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiAlertTriangle, FiMapPin, FiCalendar, FiClock,
  FiSearch, FiFilter, FiPlus, FiX, FiUpload
} from 'react-icons/fi';
import incidentData from '../data/karachi_town_data.json';
import { getStoredUser } from '../utils/authUtils';

const ReportIncidentModal = ({ onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: "", description: "", town: "", subdivision: "", category: "",
    urgency: "normal", date: "", isAnonymous: false, images: [],
    videos: [], audios: [], severity: "", zone: "", location: "",
    incidentTime: "", tags: "", tagList: [], witnessCount: "",
    suspectInfo: "", reportedToPolice: "",
  });

  const [subdivisionOptions, setSubdivisionOptions] = useState([]);

  useEffect(() => {
    if (formData.town) {
      const subs = incidentData[formData.town]?.subdivisions || {};
      setSubdivisionOptions(Object.keys(subs));
    }
  }, [formData.town]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: [...prev[name], ...Array.from(files)],
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" && formData.tags.trim()) {
      e.preventDefault();
      if (!formData.tagList.includes(formData.tags.trim())) {
        setFormData((prev) => ({
          ...prev,
          tagList: [...prev.tagList, prev.tags.trim()],
          tags: "",
        }));
      }
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tagList: prev.tagList.filter((t) => t !== tag),
    }));
  };

  const removeMedia = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const renderMediaPreview = (files) => (
    <div className="media-previews">
      {files.map((file, index) => (
        <div key={index} className="media-preview">
          <button onClick={() => removeMedia(files === formData.images ? "images" : 
            files === formData.videos ? "videos" : "audios", index)}>
            <FiX />
          </button>
          <div>{file.name}</div>
        </div>
      ))}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Your session expired. Please log in again.");
      return;
    }

    try {
      const fd = new FormData();
      for (const key in formData) {
        if (["images", "videos", "audios"].includes(key)) {
          formData[key].forEach((file) => fd.append(key, file));
        } else if (key === "tagList") {
          formData[key].forEach((tag) => fd.append("tags[]", tag));
        } else {
          fd.append(key, formData[key]);
        }
      }

      await axios.post("http://localhost:5000/api/incidents", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      alert("Incident reported successfully!");
      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Error submitting incident.");
    }
  };

  return (
    <div className="report-form-modal">
      <div className="form-container">
        <div className="form-header">
          <h2><FiAlertTriangle /> Report an Incident</h2>
          <button onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Incident Title *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description *</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows={4} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Town *</label>
              <select 
                name="town" 
                value={formData.town} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select Town</option>
                {Object.keys(incidentData).map((town) => (
                  <option key={town} value={town}>{town}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Subdivision *</label>
              <select 
                name="subdivision" 
                value={formData.subdivision} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select Subdivision</option>
                {subdivisionOptions.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                <option value="robbery">Robbery</option>
                <option value="assault">Assault</option>
                <option value="suspicious">Suspicious Activity</option>
                <option value="missing">Missing Person</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Urgency</label>
              <select 
                name="urgency" 
                value={formData.urgency} 
                onChange={handleInputChange}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <div className="input-with-icon">
                <FiCalendar />
                <input 
                  type="date" 
                  name="date" 
                  style={{color:'black'}}
                  value={formData.date} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Time</label>
              <div className="input-with-icon">
                <FiClock />
                <input 
                  type="time" 
                  name="incidentTime" 
                    style={{color:'black'}}
                  value={formData.incidentTime} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Location Details</label>
            <input 
              type="text" 
              name="location" 
              placeholder="Exact location or landmark" 
              value={formData.location} 
              onChange={handleInputChange} 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Severity</label>
              <select 
                name="severity" 
                value={formData.severity} 
                onChange={handleInputChange}
              >
                <option value="">Select Severity</option>
                <option value="1">1 - Low</option>
                <option value="2">2 - Moderate</option>
                <option value="3">3 - Serious</option>
                <option value="4">4 - Dangerous</option>
                <option value="5">5 - Critical</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Risk Zone</label>
              <select 
                name="zone" 
                value={formData.zone} 
                onChange={handleInputChange}
              >
                <option value="">Select Risk Zone</option>
                <option value="red">🔴 Red Zone</option>
                <option value="orange">🟠 Orange Zone</option>
                <option value="yellow">🟡 Yellow Zone</option>
                <option value="green">🟢 Safe Zone</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tags (Press Enter to add)</label>
            <input 
              type="text" 
              name="tags" 
              value={formData.tags} 
              placeholder="e.g. knife, gang, vehicle" 
              onChange={handleInputChange} 
              onKeyDown={handleTagInput} 
            />
            <div className="tag-container">
              {formData.tagList.map((tag, index) => (
                <span key={index} className="tag">
                  {tag} <FiX onClick={() => removeTag(tag)} />
                </span>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Witness Count</label>
              <input 
                type="number" 
                name="witnessCount" 
                placeholder="Number of witnesses" 
                value={formData.witnessCount} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="form-group">
              <label>Reported to Police?</label>
              <select 
                name="reportedToPolice" 
                value={formData.reportedToPolice} 
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Suspect Information</label>
            <textarea 
              name="suspectInfo" 
              placeholder="Suspect details / vehicle / clothes" 
              value={formData.suspectInfo} 
              onChange={handleInputChange} 
            />
          </div>

          <div className="form-group">
            <label>Add Photo Evidence</label>
           {/* File uploads */}
          <label>📸 Upload Images
            <input type="file" name="images" accept="image/*" multiple onChange={handleInputChange} />
          </label>
          {renderMediaPreview(formData.images, "image")}

          <label>🎥 Upload Videos
            <input type="file" name="videos" accept="video/*" multiple onChange={handleInputChange} />
          </label>
          {renderMediaPreview(formData.videos, "video")}

          <label>🎙️ Upload Audios
            <input type="file" name="audios" accept="audio/*" multiple onChange={handleInputChange} />
          </label>
          {renderMediaPreview(formData.audios, "audio")}
</div>

          <div className="form-actions">
            <label className="anonymous-check">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
              />
              Report anonymously
            </label>
            <div>
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Submit Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function SafetyReports() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    severity: 'all',
    search: ''
  });
  const [fetchedReports, setFetchedReports] = useState([]);
   const navigate = useNavigate();

  // Static fallback report
  const fallbackReports = [
    {
      id: 'static-1',
      type: 'harassment',
      title: 'Verbal harassment incident',
      date: '2023-05-15',
      time: '19:30',
      location: 'Liberty Market, Gulberg',
      description: 'Verbal harassment by a group of men near the entrance.',
      severity: 'medium',
      upvotes: 12,
      comments: 5
    }
  ];

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/incidents");
      if (res.data.success) {
        setFetchedReports(res.data.incidents);
      } else {
        setFetchedReports([]);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setFetchedReports([]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportButtonClick = () => {
    if (!getStoredUser()) {
      alert("Please log in to report an incident.");
    } else {
      setShowReportForm(true);
    }
  };

  const combinedReports = [...fallbackReports, ...fetchedReports];

  const filteredReports = combinedReports.filter(report => {
    return (
      (filters.type === 'all' || report.type === filters.type) &&
      (filters.severity === 'all' || report.severity === filters.severity) &&
      (report.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.location?.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  return (
    <div className="safety-reports-page">
      {/* Header */}
      <section className="reports-header">
        <h1><FiAlertTriangle /> Safety Reports</h1>
        <p className='para'>View real-time safety reports submitted by the Muhafiz community</p>
        <div className="action-buttons">
          <button className="primary-btn" onClick={handleReportButtonClick}>
            <FiPlus /> Report an Incident
          </button>
          <button className="secondary-btn" onClick={() => navigate('/heatmap')}>
      <FiMapPin /> Incident Heatmap
    </button>
        </div>
        <div className="severity-tags">
          <span className="tag safe">Safe</span>
          <span className="tag caution">Caution</span>
          <span className="tag high-risk">High Risk</span>
        </div>
      </section>

      {/* Filters */}
      <section className="search-filters">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by location or description"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="filter-options">
          <div className="filter-group">
            <label><FiFilter /> All Reports</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="harassment">Harassment</option>
              <option value="theft">Theft</option>
              <option value="road">Road Safety</option>
              <option value="suspicious">Suspicious</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            >
              <option value="all">All Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </section>

      {/* Reports */}
      <section className="reports-list">
        <h2>Recent Reports</h2>
        {filteredReports.map(report => (
          <div key={report._id || report.id} className={`report-card ${report.severity}`}>
            <div className="report-header">
              <span className="report-type">{report.type}</span>
              <span className="report-date">{report.date} • {report.time}</span>
            </div>
            <h3>{report.title}</h3>
            <p className="report-location"><FiMapPin /> {report.location}</p>
            <p className="report-desc">{report.description}</p>
            <div className="report-footer">
              <span className={`severity-badge ${report.severity}`}>
                {report.severity} severity
              </span>
              <div className="report-stats">
                <span>▲ {report.upvotes || 0}</span>
                <span>💬 {report.comments || 0}</span>
                <button className="view-details">View Details</button>
              </div>
            </div>
          </div>
        ))}
        <button className="load-more">Load More Reports</button>
      </section>

      {/* Report Form Modal */}
      {showReportForm && (
        <ReportIncidentModal 
          onClose={() => setShowReportForm(false)} 
          onSubmitSuccess={fetchReports}
        />
      )}
    </div>
  );
}