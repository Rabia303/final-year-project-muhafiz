import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import incidentData from "../data/karachi_town_data.json";
import { getStoredUser, isTokenExpired } from "../utils/authUtils"; // make sure path is correct

const ReportIncidentForm = () => {
  const navigate = useNavigate();

  // Redirect to login if user not authenticated
  useEffect(() => {
    if (!getStoredUser()) {
      alert("Please log in to report an incident.");
      navigate("/login");
    }
  }, []);

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

  const renderMediaPreview = (files, type) => (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {files.map((file, index) => (
        <div key={index} style={{ position: "relative", padding: "8px", border: "1px solid #ddd", borderRadius: "6px" }}>
          <button onClick={() => removeMedia(type + "s", index)} title="Remove" style={{ position: "absolute", top: 0, right: 0, background: "transparent", border: "none" }}>
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
    if (!token || isTokenExpired()) {
      alert("Your session expired. Please log in again.");
      navigate("/login");
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
      setFormData({
        title: "", description: "", town: "", subdivision: "", category: "",
        urgency: "normal", date: "", isAnonymous: false, images: [],
        videos: [], audios: [], severity: "", zone: "", location: "",
        incidentTime: "", tagList: [], witnessCount: "",
        suspectInfo: "", reportedToPolice: "",
      });
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Error submitting incident.");
    }
  };
  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={formContainer}>
        <h2 style={titleStyle}>🚨 Report a Safety Incident (Static Preview)</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input type="text" name="title" placeholder="Title *" value={formData.title} onChange={handleInputChange} className="premium-input" />
          <textarea name="description" placeholder="Description *" value={formData.description} onChange={handleInputChange} rows={4} className="premium-input" />

          <select name="town" value={formData.town} onChange={handleInputChange} className="premium-input">
            <option value="">Select Town *</option>
            {Object.keys(incidentData).map((town) => (
              <option key={town} value={town}>{town}</option>
            ))}
          </select>

          <select name="subdivision" value={formData.subdivision} onChange={handleInputChange} className="premium-input">
            <option value="">Select Subdivision *</option>
            {subdivisionOptions.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          <select name="category" value={formData.category} onChange={handleInputChange} className="premium-input">
            <option value="">Select Category</option>
            <option value="robbery">Robbery</option>
            <option value="assault">Assault</option>
            <option value="suspicious">Suspicious Activity</option>
            <option value="missing">Missing Person</option>
            <option value="other">Other</option>
          </select>

          <select name="urgency" value={formData.urgency} onChange={handleInputChange} className="premium-input">
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="critical">Critical</option>
          </select>

          <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="premium-input" />
          <input type="time" name="incidentTime" value={formData.incidentTime} onChange={handleInputChange} className="premium-input" />
          <input type="text" name="location" placeholder="Exact location or landmark" value={formData.location} onChange={handleInputChange} className="premium-input" />

          <select name="severity" value={formData.severity} onChange={handleInputChange} className="premium-input">
            <option value="">Select Severity</option>
            <option value="1">1 - Low</option>
            <option value="2">2 - Moderate</option>
            <option value="3">3 - Serious</option>
            <option value="4">4 - Dangerous</option>
            <option value="5">5 - Critical</option>
          </select>

          <select name="zone" value={formData.zone} onChange={handleInputChange} className="premium-input">
            <option value="">Select Risk Zone</option>
            <option value="red">🔴 Red Zone</option>
            <option value="orange">🟠 Orange Zone</option>
            <option value="yellow">🟡 Yellow Zone</option>
            <option value="green">🟢 Safe Zone</option>
          </select>

          <input type="text" name="tags" value={formData.tags} placeholder="Press Enter to add tags (e.g. knife, gang)" onChange={handleInputChange} onKeyDown={handleTagInput} className="premium-input" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {formData.tagList.map((tag, index) => (
              <span key={index} style={tagStyle}>
                {tag} <FiX onClick={() => removeTag(tag)} style={{ cursor: "pointer" }} />
              </span>
            ))}
          </div>

          <input type="number" name="witnessCount" placeholder="Number of witnesses" value={formData.witnessCount} onChange={handleInputChange} className="premium-input" />
          <textarea name="suspectInfo" placeholder="Suspect details / vehicle / clothes" value={formData.suspectInfo} onChange={handleInputChange} className="premium-input" />

          <select name="reportedToPolice" value={formData.reportedToPolice} onChange={handleInputChange} className="premium-input">
            <option value="">Was it reported to police?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

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

          <label>
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleInputChange}
            />
            Post Anonymously
          </label>

          <button type="submit" className="submit-btn glow-btn">Report Incident</button>
        </form>
      </div>
    </div>
  );
};


// Styles
const formContainer = {
  padding: "30px",
  maxWidth: "850px",
  margin: "0 auto",
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "24px",
  color: "#2D235A",
};

const previewContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginTop: "10px",
};

const mediaWrapper = {
  position: "relative",
  width: "100px",
  height: "80px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
};

const mediaStyle = {
  textAlign: "center",
  fontSize: "12px",
};

const removeBtn = {
  position: "absolute",
  top: "4px",
  right: "4px",
  background: "#ff4d4d",
  border: "none",
  borderRadius: "50%",
  color: "white",
  width: "20px",
  height: "20px",
  fontSize: "12px",
  cursor: "pointer",
};

const labelStyle = {
  fontWeight: "bold",
  fontSize: "14px",
  marginBottom: "4px",
};

const tagStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#e0f7fa",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "13px",
  gap: "6px",
};

export default ReportIncidentForm;
