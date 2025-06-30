import React, { useState, useEffect } from 'react';
import axios from "axios";
import { FiSmile, FiMapPin } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getStoredUser } from "../utils/authUtils"; // adjust path if needed
import 'react-toastify/dist/ReactToastify.css';
import '../CreateChannel.css';

const UserCreateChannel = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    area: '',
    imageUrl: '',
    visibility: 'public',
    category: ''
  });

  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to create a channel");
      navigate("/login");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationStr = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          setFormData((prev) => ({
            ...prev,
            area: locationStr
          }));
        },
        (error) => toast.error('Could not get location: ' + error.message)
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim())
      };

      const response = await axios.post("http://localhost:5000/api/discussion-channels", postData, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });

      if (response.data.success) {
        toast.success("Channel created successfully!");
        setFormData({
          title: '',
          description: '',
          tags: '',
          area: '',
          imageUrl: '',
          visibility: 'public',
          category: ''
        });
        setShowSuccess(true);
      } else {
        toast.error("Failed to create channel");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred during submission.");
    }
  };

  return (
    <div className="incident-form glass-card">
      <div className="form-header">
        <FiSmile className="form-icon" />
        <h2>Create a Community Channel</h2>
        <p className="form-subtext">Start a discussion or share an important safety topic with your area.</p>
      </div>

      <form onSubmit={handleSubmit} className="premium-form">
        <div className="form-group">
          <input
            name="title"
            placeholder="Enter channel title"
            value={formData.title}
            onChange={handleChange}
            required
            className="premium-input"
          />
        </div>

        <div className="form-group">
          <textarea
            name="description"
            placeholder="Describe the topic or purpose of this channel"
            value={formData.description}
            onChange={handleChange}
            className="premium-textarea"
          />
        </div>

        <div className="form-group">
          <input
            name="tags"
            placeholder="Add tags (comma separated)"
            value={formData.tags}
            onChange={handleChange}
            className="premium-input"
          />
        </div>

        <div className="form-group">
          <input
            name="area"
            placeholder="Area (e.g., Clifton Block 7, Lyari)"
            value={formData.area}
            onChange={handleChange}
            className="premium-input"
          />
          <button type="button" className="location-btn glow-btn" onClick={handleLocationClick}>
            <FiMapPin /> Use My Location
          </button>
        </div>

        <div className="form-group">
          <input
            name="imageUrl"
            placeholder="Optional image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            className="premium-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="premium-input"
          >
            <option value="">Select Category</option>
            <option value="safety">Safety</option>
            <option value="awareness">Awareness</option>
            <option value="alerts">Crime Alerts</option>
            <option value="community">Community Talk</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="visibility">Visibility</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="premium-input"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn form-cta glow-btn">
            Create Channel
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="success-banner">
          🎉 Your channel has been created successfully!
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserCreateChannel;
