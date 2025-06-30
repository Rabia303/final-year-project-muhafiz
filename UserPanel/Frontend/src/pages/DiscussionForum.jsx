import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import FilterBar from '../components/FilterBar';
import ReportIncidentForm from '../components/ReportIncidentForm';
import ShareThoughtForm from '../components/ShareThoughtForm';
import Discussion from '../components/DiscussionCard';
import '../App.css';
const user = JSON.parse(localStorage.getItem("user"));


export default function DiscussionForum() {
  const { channelId } = useParams();
  const [formType, setFormType] = useState('post');
  // const [addSharedPost, setAddSharedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (channelId) {
      // Fetch the discussion channel info
      axios.get(`http://localhost:5000/api/discussion-channels/${channelId}`)
        .then(res => setChannel(res.data.channel))
        .catch(err => console.error("Channel fetch failed", err));

      // Fetch all posts related to that channel
      axios.get(`http://localhost:5000/api/posts?channelId=${channelId}`)
        .then(res => setPosts(res.data.posts))
        .catch(err => console.error("Post fetch failed", err));
    }
  }, [channelId]);

  // Handle post submission from ShareThoughtForm
  const handleAddPost = async (postData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/posts",
        { ...postData, channelId },
        {
          headers: {
            Authorization: token
          }
        }
      );

      if (res.data.success) {
        setPosts(prev => [res.data.post, ...prev]);
      }
    } catch (err) {
      console.error("Failed to submit post:", err);
    }
  };


  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <FilterBar />

        <h2>{channel?.title}</h2>
        <p className="form-subtext">{channel?.description}</p>

        <div className="form-toggle-container">
          <button
            className={`form-toggle-btn ${formType === 'incident' ? 'active' : ''}`}
            onClick={() => setFormType('incident')}
          >
            Report Incident
          </button>
          <button
            className={`form-toggle-btn ${formType === 'post' ? 'active' : ''}`}
            onClick={() => setFormType('post')}
          >
            Share Thoughts
          </button>
        </div>

        {user ? (
          <div className="form-section">
            {formType === 'incident' ? (
              <ReportIncidentForm />
            ) : (
              <ShareThoughtForm onSubmit={handleAddPost} channelId={channelId} />
            )}
          </div>
        ) : (
          <p style={{ marginTop: "2rem", color: "red" }}>
            Please log in to share thoughts or incidents.
          </p>
        )}


        <Discussion customPosts={posts} />
      </main>

      <RightSidebar />
    </div>
  );
}
