// CommunityForum.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiMessageSquare, FiBook, FiAlertTriangle,
  FiUsers, FiDownload, FiClock, FiPlus
} from 'react-icons/fi';

export default function CommunityForum() {
  const [activeTab, setActiveTab] = useState('topics');
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/discussion-channels");
        if (res.data.success) {
          setChannels(res.data.channels);
        }
      } catch (err) {
        console.error("Error fetching channels:", err);
      }
    };

    fetchChannels();
  }, []);

  // Sample forum topics data
  // const forumTopics = [
  //   {
  //     category: 'Safety Tips',
  //     title: 'Safety Tips for Public Transportation',
  //     posts: 24,
  //     lastActive: '2 hours ago'
  //   },
  //   {
  //     category: 'Personal Stories',
  //     title: 'My Experience with Street Harassment',
  //     posts: 37,
  //     lastActive: '5 hours ago'
  //   },
  //   {
  //     category: 'Local Alerts',
  //     title: 'Alert: Increased Incidents in Johar Town',
  //     posts: 12,
  //     lastActive: '1 day ago'
  //   },
  //   {
  //     category: 'Resources',
  //     title: 'Self-Defense Classes in Lahore',
  //     posts: 18,
  //     lastActive: '2 days ago'
  //   },
  //   {
  //     category: 'Safety Tips',
  //     title: 'How to Report Incidents Effectively',
  //     posts: 29,
  //     lastActive: '3 days ago'
  //   }
  // ];

  // Sample resources data
  const resources = [
    {
      title: 'Personal Safety Guide for Women',
      type: 'PDF',
      size: '2.4 MB'
    },
    {
      title: 'Emergency Contacts Directory',
      type: 'PDF',
      size: '1.8 MB'
    },
    {
      title: 'Self-Defense Basics',
      type: 'PDF',
      size: '3.2 MB'
    }
  ];

  return (
    <div className="community-forum-page">
      {/* Header Section */}
      <section className="forum-header">
        <h1><FiUsers /> Community Forum</h1>
        <p className='title'>Join discussions on safety, share experiences, and connect with others</p>

        <div className="forum-tabs">
          <button
            className={`tab-btn ${activeTab === 'topics' ? 'active' : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            <FiMessageSquare /> Discussion Topics
          </button>
          <button
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            <FiBook /> Resources & Guides
          </button>
          <button
            className={`tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
            onClick={() => setActiveTab('guidelines')}
          >
            <FiAlertTriangle /> Community Guidelines
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="forum-content">
        {activeTab === 'topics' && (
          <section className="topics-section">
            <div className="section-header">
              <h2>View All Topics</h2>
              <button className="new-topic-btn" onClick={() => navigate('/create-channel')}>
                <FiPlus /> New Topic
              </button>

            </div>

            <div className="topics-list">
              {channels.length > 0 ? (
                channels.map((channel, index) => (
                  <div key={index} className="topic-card">
                    <div className="topic-category">{channel.category}</div>
                    <h3 className="topic-title">{channel.title}</h3>
                    <div className="topic-meta">
                      <span><FiMessageSquare /> {channel.tags?.length || 0} tags</span>
                      <span><FiClock /> {new Date(channel.createdAt).toLocaleString()}</span>
                    </div>
                    <button
                      className="join-discussion-btn"
                      onClick={() => navigate(`/discussion/${channel._id}`)} // you can later make this route dynamic
                    >
                      Join Discussion
                    </button>
          
                  </div>
                ))
              ) : (
                <p>No channels found.</p>
              )}

            </div>

            <button className="load-more-btn">
              Load More Topics
            </button>
          </section>
        )}

        {activeTab === 'resources' && (
          <section className="resources-section">
            <h2>Download helpful materials to enhance your safety knowledge</h2>

            <div className="resources-grid">
              {resources.map((resource, index) => (
                <div key={index} className="resource-card">
                  <div className="resource-icon">
                    <FiBook />
                  </div>
                  <div className="resource-info">
                    <h3>{resource.title}</h3>
                    <p>{resource.type} • {resource.size}</p>
                  </div>
                  <button className="download-btn">
                    <FiDownload /> Download
                  </button>
                </div>
              ))}
            </div>

            <button className="view-all-btn">
              View All Resources
            </button>
          </section>
        )}

        {activeTab === 'guidelines' && (
          <section className="guidelines-section">
            <h2>Community Guidelines</h2>
            <p className="intro-text">
              To ensure our community remains a safe and supportive space for all members,
              we've established the following guidelines:
            </p>
            <ul className="guidelines-list" >
              <li>Treat all community members with respect and dignity</li>
              <li>Do not share personal identifying information about yourself or others</li>
              <li>Report incidents accurately and honestly</li>
              <li>Avoid sharing graphic or disturbing content without appropriate warnings</li>
              <li>Focus on constructive discussions that contribute to community safety</li>
            </ul>

            <div className="moderation-notice">
              <p>
                Our moderation team reviews all reported content and takes appropriate action
                to maintain a supportive environment. Repeated violations may result in
                temporary or permanent removal from the community.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}