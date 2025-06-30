
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

// Models & Middleware
const Post = require("./models/Post");
const Incident = require("./models/Incident");
const DiscussionChannel = require("./models/discussionChannelModel");
const verifyToken = require("./middleware/verifyToken");

// Routes
const authRoutes = require("./routes/authRoutes");
const zoneRoutes = require("./routes/zoneRoutes");

// ========== Middleware ==========
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());
// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========== File Upload ==========
const upload = multer({ dest: "uploads/" });

// ========== Routes ==========

// Zones (proxy to Flask)
app.use("/api/zones", zoneRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes); 

// Auth
app.use("/api/auth", authRoutes);

// ----- Discussion Channels -----
app.post("/api/discussion-channels", verifyToken, async (req, res) => {
  try {
    const newChannel = new DiscussionChannel({ ...req.body, createdBy: req.user.id });
    const saved = await newChannel.save();
    res.status(201).json({ success: true, channel: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/discussion-channels", async (req, res) => {
  try {
    const channels = await DiscussionChannel.find().sort({ createdAt: -1 });
    res.json({ success: true, channels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/discussion-channels/:id", async (req, res) => {
  try {
    const channel = await DiscussionChannel.findById(req.params.id);
    if (!channel) return res.status(404).json({ success: false, error: "Channel not found" });
    res.json({ success: true, channel });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----- Post Creation (with Media) -----
app.post("/api/posts", verifyToken, upload.array("media"), async (req, res) => {
  try {
    const media = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith("image")
        ? "image"
        : file.mimetype.startsWith("video")
        ? "video"
        : "audio"
    }));

    const tags = Array.isArray(req.body['tags[]'])
      ? req.body['tags[]']
      : req.body['tags[]']?.split(',').map(t => t.trim()) || [];

    const newPost = new Post({
      message: req.body.message,
      emotion: req.body.emotion,
      location: req.body.location,
      isAnonymous: req.body.isAnonymous === 'true',
      severity: req.body.severity,
      channelId: req.body.channelId,
      createdBy: req.user.id,
      tags,
      media,
      user: req.body.isAnonymous === 'true' ? 'Anonymous' : req.user.name,
    });

    const saved = await newPost.save();
    res.status(201).json({ success: true, post: saved });
  } catch (err) {
    console.error("Post error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----- Get Posts -----
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find({ channelId: req.query.channelId }).sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----- Reply to Post -----
app.post("/api/posts/:postId/replies", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, error: "Post not found" });

    const reply = {
      user: req.body.user || "Community Member",
      text: req.body.text,
      timestamp: new Date().toISOString(),
      reactions: {},
      replies: [],
      isOfficial: false,
      createdBy: req.user.id
    };

    post.replies.push(reply);
    await post.save();

    res.status(200).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----- React to Post -----
app.post("/api/posts/:postId/react", verifyToken, async (req, res) => {
  const { reaction } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, error: "Post not found" });

    const currentReactions = post.reactions.get(userId) || [];

    if (currentReactions.includes(reaction)) {
      post.reactions.set(userId, currentReactions.filter(r => r !== reaction));
    } else {
      post.reactions.set(userId, [...currentReactions, reaction]);
    }

    await post.save();
    res.status(200).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----- Report Incident -----
app.post("/api/incidents", verifyToken, upload.fields([
  { name: "images", maxCount: 5 },
  { name: "videos", maxCount: 3 },
  { name: "audios", maxCount: 3 }
]), async (req, res) => {
  try {
    const {
      title, description, town, subdivision, category, urgency,
      date, incidentTime, location, severity, zone,
      isAnonymous, tags, witnessCount, suspectInfo, reportedToPolice
    } = req.body;

    const incident = new Incident({
      title,
      description,
      town,
      subdivision,
      category,
      urgency,
      date,
      incidentTime,
      location,
      severity,
      zone,
      isAnonymous: isAnonymous === "true",
      tags: Array.isArray(req.body['tags[]'])
        ? req.body['tags[]']
        : req.body['tags[]']
        ? [req.body['tags[]']]
        : [],
      witnessCount,
      suspectInfo,
      reportedToPolice,
      images: req.files?.images?.map(f => `/uploads/${f.filename}`) || [],
      videos: req.files?.videos?.map(f => `/uploads/${f.filename}`) || [],
      audios: req.files?.audios?.map(f => `/uploads/${f.filename}`) || [],
      createdBy: req.user.id,
    });

    const saved = await incident.save();
    res.status(201).json({ success: true, incident: saved });
  } catch (err) {
    console.error("Incident error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/incidents", async (req, res) => {
  try {
    const incidents = await Incident.find().populate("createdBy", "name email"); // optional: include user info
    res.json(incidents);
  } catch (err) {
    console.error("Fetch incidents error:", err.message);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

// Update status (approve/reject)
app.put("/api/incidents/:id/status", async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(incident);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update status" });
  }
});

// Delete incident
app.delete("/api/incidents/:id", async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete" });
  }
});


app.put("/api/incidents/:id", async (req, res) => {
  try {
    const updated = await Incident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Incident not found" });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Edit error:", err.message);
    res.status(500).json({ msg: "Error updating incident" });
  }
});


// Proxy API: React → Express → Flask
app.post("/api/safe-route", async (req, res) => {
  try {
    const response = await axios.post(
      `http://localhost:5001/safe-route`, // Fixed port number
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("Flask API error:", error.message);
    res.status(500).json({ error: "Failed to fetch from Python API" });
  }
});

app.put("/api/incidents/:id", async (req, res) => {
  try {
    const updated = await Incident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ msg: "Incident not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update incident" });
  }
});

// Routes

// GET: Fetch all incidents
app.get("/api/incidents", async (req, res) => {
  try {
    const incidents = await Incident.find().populate("createdBy", "name email").sort({ date: -1 });
    res.json(incidents);
  } catch (err) {
    console.error("Error fetching incidents:", err);
    res.status(500).json({ msg: "Error fetching incidents" });
  }
});

// Optional: DELETE an incident by ID
app.delete("/api/incidents/:id", async (req, res) => {
  try {
    const deleted = await Incident.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Incident not found" });
    res.json({ msg: "Incident deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Server error while deleting incident" });
  }
});

app.get("/api/incidents", async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch incidents" });
  }
});

// ========== MongoDB Connection ==========
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err.message));
