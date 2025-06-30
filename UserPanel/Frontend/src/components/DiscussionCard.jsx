import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiMessageSquare, FiClock, FiAlertCircle, FiMapPin
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getStoredUser } from "../utils/authUtils";
import "../1.css";

const reactionTypes = [
  { emoji: "👍", name: "like" },
  { emoji: "⚠️", name: "warning" },
  { emoji: "🚨", name: "alert" },
  { emoji: "✅", name: "confirmed" },
  { emoji: "❌", name: "dispute" },
];

const formatTimestamp = (isoString) => {
  const time = new Date(isoString);
  const now = new Date();
  const diff = (now - time) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return time.toLocaleDateString();
};

const Avatar = ({ username }) => {
  const initials = username?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const bgColor = `#${intToRGB(hashCode(username || "user"))}`;
  return (
    <div className="avatar-circle" style={{ backgroundColor: bgColor }}>
      {initials || "U"}
    </div>
  );
};

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}
function intToRGB(i) {
  const c = (i & 0x00FFFFFF).toString(16).toUpperCase();
  return "00000".substring(0, 6 - c.length) + c;
}

function Comment({ comment, postId, level = 0, fetchPosts }) {
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const user = getStoredUser();
  const currentUserId = user?.id;
  const userReaction = comment.reactions?.[currentUserId] || [];

  const handleReaction = async (reactionType) => {
    if (!currentUserId) return alert("Login required to react");
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/react`, {
        reaction: reactionType,
      }, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      fetchPosts();
    } catch (err) {
      console.error("Reaction failed", err);
    }
  };

  const handleReplySubmit = async () => {
    if (!currentUserId) return alert("Login required to reply");
    if (!replyText.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/replies`, {
        user: user?.name || "Community Member",
        text: replyText,
        timestamp: new Date().toISOString(),
        reactions: {},
        replies: [],
        isOfficial: false
      }, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      setReplyText("");
      setReplying(false);
      fetchPosts();
    } catch (err) {
      console.error("Reply failed", err);
    }
  };

  return (
    <div className="discussion-card" style={{ marginLeft: level * 20 }}>
{/* HEADER + USER */}
<div className="discussion-header">
  <Avatar username={comment.user || "User"} />
  <div>
    <div className="username">{comment.user || "Anonymous"}</div>
    <div className="timestamp"><FiClock /> {formatTimestamp(comment.timestamp)}</div>
  </div>
</div>

{/* MAIN MESSAGE */}
<p className="discussion-body">{comment.message || comment.text}</p>

{/* METADATA INLINE */}
<div className="meta-group">
  {comment.emotion && (
    <span className="meta-item">😔 <strong>{comment.emotion}</strong></span>
  )}
  {comment.severity && (
    <span className={`meta-item severity ${comment.severity.toLowerCase()}`}>
      🚦 <strong>{comment.severity}</strong>
    </span>
  )}
  {comment.location && (
    <span className="meta-item"><FiMapPin /> {comment.location}</span>
  )}
</div>

{/* TAGS */}
{comment.tags?.length > 0 && (
  <div className="tag-row">
    {comment.tags.map((tag, i) => (
      <span className="tag" key={i}>#{tag}</span>
    ))}
  </div>
)}

{/* MEDIA */}
{comment.media?.length > 0 && (
  <div className="media-gallery">
    {comment.media.map((media, i) => (
      <div key={i} className="media-preview-item">
        {media.type === "image" && <img src={`http://localhost:5000${media.url}`} alt="evidence" />}
        {media.type === "video" && <video src={`http://localhost:5000${media.url}`} controls />}
        {media.type === "audio" && <audio src={`http://localhost:5000${media.url}`} controls />}
      </div>
    ))}
  </div>
)}

      <div className="discussion-meta">
        <div className="reaction-group">
          {reactionTypes.map(({ emoji, name }) => (
            <button
              key={name}
              onClick={() => handleReaction(name)}
              className={`reaction-btn ${userReaction.includes(name) ? "active" : ""}`}
            >
              {emoji} {Object.values(comment.reactions || {}).filter(r => r.includes(name)).length}
            </button>
          ))}
        </div>
        <button onClick={() => setReplying(!replying)} className="reply-btn">
          <FiMessageSquare /> {replying ? "Cancel" : "Reply"}
        </button>
      </div>

      {replying && (
        <div className="reply-form">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="reply-input"
          />
          <button onClick={handleReplySubmit} className="submit-btn glow-btn">Post Reply</button>
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply, i) => (
            <Comment
              key={i}
              comment={reply}
              postId={postId}
              level={level + 1}
              fetchPosts={fetchPosts}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Discussion() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { channelId } = useParams();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/posts?channelId=${channelId}`);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    fetchPosts();
  }, [channelId]);

  return (
    <div className="discussion-container">
      <div className="discussion-header">
        <h2><FiAlertCircle /> Community Discussion</h2>
        <p>View real reports, contribute, react & connect with your area.</p>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet. Be the first to share.</p>
      ) : (
        posts.map((post) => (
          <Comment
            key={post._id}
            comment={post}
            postId={post._id}
            fetchPosts={fetchPosts}
          />
        ))
      )}
    </div>
  );
}
