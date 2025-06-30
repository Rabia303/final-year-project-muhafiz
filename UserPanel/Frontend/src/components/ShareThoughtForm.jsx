import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FiCamera, FiVideo, FiMic, FiSmile, FiMapPin, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getStoredUser } from '../utils/authUtils';
import 'react-toastify/dist/ReactToastify.css';

const ShareThoughtForm = ({ channelId }) => {
  const [formData, setFormData] = useState({
    message: '',
    emotion: '',
    location: '',
    tags: '',
    isAnonymous: false,
    severity: 'Low',
    media: []
  });

  const fileInputRef = useRef(null);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationClick = () => {
    navigator.geolocation?.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
        }));
      },
      error => toast.error('Could not get location: ' + error.message)
    );
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => {
      const previewUrl = URL.createObjectURL(file);
      return {
        file,
        type: file.type.startsWith('image') ? 'image' :
          file.type.startsWith('video') ? 'video' : 'audio',
        previewUrl
      };
    });

    setMediaPreviews(prev => [...prev, ...newMedia]);
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...newMedia]
    }));
  };

  const removeMedia = (index) => {
    const newPreviews = [...mediaPreviews];
    URL.revokeObjectURL(newPreviews[index].previewUrl);
    newPreviews.splice(index, 1);
    setMediaPreviews(newPreviews);

    const newMedia = [...formData.media];
    newMedia.splice(index, 1);
    setFormData(prev => ({ ...prev, media: newMedia }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getStoredUser();
    const token = localStorage.getItem("token");

    if (!user || !token) return toast.error("You must be logged in to post.");
    if (!channelId) return toast.error("Missing channel ID");

    const form = new FormData();
    form.append("message", formData.message);
    form.append("emotion", formData.emotion);
    form.append("location", formData.location);
    // form.append("isAnonymous", formData.isAnonymous);
    form.append("createdBy", formData.isAnonymous ? "Anonymous" : user.id);
    form.append("severity", formData.severity);
    form.append("channelId", channelId);
    form.append("createdBy", user.id);

    formData.tags.split(',').map(tag => tag.trim()).forEach(tag => form.append("tags[]", tag));
    formData.media.forEach(m => form.append("media", m.file));

    try {
      setSubmitting(true);
      const res = await axios.post("http://localhost:5000/api/posts", form, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data.success) {
        toast.success("Post shared!");
        setFormData({
          message: '', emotion: '', location: '', tags: '',
          isAnonymous: false, severity: 'Low', media: []
        });
        setMediaPreviews([]);
      } else {
        toast.error("Failed to share post.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Error submitting post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="incident-form glass-card">
      <div className="form-header">
        <FiSmile className="form-icon" />
        <h2>Share Your Thoughts</h2>
        <p>Felt unsafe? Seen something odd? Let your community know.</p>
      </div>

      <form onSubmit={handleSubmit} className="premium-form">
        <textarea
          name="message"
          placeholder="What's on your mind?"
          value={formData.message}
          onChange={handleChange}
          required
          className="premium-textarea"
        />

        <input
          type="text"
          name="emotion"
          placeholder="How did it make you feel?"
          value={formData.emotion}
          onChange={handleChange}
          className="premium-input"
        />

        <div className="input-with-icon">
          <FiMapPin className="input-icon" />
          <input
            type="text"
            name="location"
            placeholder="Location (e.g., Lyari)"
            value={formData.location}
            onChange={handleChange}
            className="premium-input"
          />
        </div>

        <label>Severity</label>
        <select name="severity" value={formData.severity} onChange={handleChange} className="premium-input">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button type="button" className="location-btn glow-btn" onClick={handleLocationClick}>
          <FiMapPin /> Use My Location
        </button>
<br />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          className="premium-input"
        />

        <div className="form-group">
          <h3>Attach Media</h3>
          <div className="media-upload-buttons">
            <button type="button" className="upload-btn media-btn" onClick={() => fileInputRef.current.click()}><FiCamera /> Photo</button>
            <button type="button" className="upload-btn media-btn" onClick={() => fileInputRef.current.click()}><FiVideo /> Video</button>
            <button type="button" className="upload-btn media-btn" onClick={() => fileInputRef.current.click()}><FiMic /> Audio</button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaUpload}
              accept="image/*,video/*,audio/*"
              multiple hidden
            />
          </div>

          {mediaPreviews.length > 0 && (
            <div className="media-preview-grid">
              {mediaPreviews.map((m, i) => (
                <div key={i} className="media-preview-item">
                  {m.type === 'image' && <img src={m.previewUrl} alt="Preview" />}
                  {m.type === 'video' && <video src={m.previewUrl} controls />}
                  {m.type === 'audio' && <audio src={m.previewUrl} controls />}
                  <button onClick={() => removeMedia(i)}><FiX /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              style={{ marginRight: '6px' }}
            />
            Post Anonymously
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn form-cta glow-btn">
            Share Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShareThoughtForm;
