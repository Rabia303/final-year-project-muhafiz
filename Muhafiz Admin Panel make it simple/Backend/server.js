// server.js (Full Updated Version with Geo-Based Heatmap)
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const csv = require("csv-parser");
const Incident = require("../../userpanel/backend/models/Incident");
const User = require("../../userpanel/backend/models/User");
const Admin = require("./models/Admin");

const app = express();
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


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// CSV Data Store
let csvIncidents = [];
fs.createReadStream("karachi_crime_dataset.csv")
  .pipe(csv())
  .on("data", (row) => {
    csvIncidents.push(row);
  })
  .on("end", () => {
    console.log("CSV data loaded:", csvIncidents.length, "rows");
  });

// ANALYTICS API
app.get("/api/analytics", async (req, res) => {
  try {
    let mongoData = [];
    try {
      mongoData = await Incident.find();
    } catch (e) {
      console.warn("MongoDB incident fetch failed, using CSV only.");
    }

    const allIncidents = [
      ...mongoData.map(inc => ({
        crimeType: inc.category || '',
        town: inc.town || '',
        date: inc.date || '',
        severity: inc.severity || '',
      })),
      ...csvIncidents.map(inc => ({
        crimeType: inc.CRIME_TYPE,
        town: inc.TOWN,
        date: inc.DATE,
        severity: inc.SEVERITY,
      }))
    ];

    const crimeByType = {};
    const crimeByArea = {};
    const incidentsOverTime = {};
    const severityDistribution = {};

    allIncidents.forEach((inc) => {
      const { crimeType, town, date, severity } = inc;

      crimeByType[crimeType] = (crimeByType[crimeType] || 0) + 1;
      crimeByArea[town] = (crimeByArea[town] || 0) + 1;
      severityDistribution[severity] = (severityDistribution[severity] || 0) + 1;

      const d = new Date(date);
      if (!isNaN(d)) {
        const month = d.toLocaleString("default", { month: "short" });
        incidentsOverTime[month] = (incidentsOverTime[month] || 0) + 1;
      }
    });

    const formatChartData = (obj) =>
      Object.entries(obj).map(([label, value]) => ({ label, value }));

    res.json({
      crimeByType: formatChartData(crimeByType),
      crimeByArea: formatChartData(crimeByArea),
      incidentsOverTime: formatChartData(incidentsOverTime),
      severityDistribution: formatChartData(severityDistribution),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating analytics" });
  }
});

// 🔥 Heatmap API - Generate 10x10 grid with values based on filters
app.get('/api/heatmap', (req, res) => {
  const { type = 'incidents', range = 'week' } = req.query;

  // For now, mock data — replace with MongoDB or CSV filtering logic later
  const data = [];
  for (let i = 0; i < 30; i++) {
    data.push({
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
      value: Math.floor(Math.random() * 100) + 1
    });
  }

  res.json(data);
});


// GEO-BASED HEATMAP API
app.get("/api/heatmap", async (req, res) => {
  try {
    const { type = 'incidents', range = 'month' } = req.query;

    let mongoData = [];
    try {
      mongoData = await Incident.find();
    } catch (e) {
      console.warn("MongoDB fetch failed, using CSV only.");
    }

    const allIncidents = [
      ...mongoData.map(inc => ({ category: inc.category || '', town: inc.town || '', date: inc.date || '' })),
      ...csvIncidents.map(inc => ({ category: inc.CRIME_TYPE, town: inc.TOWN, date: inc.DATE }))
    ];

    const townGridMap = {
      "Lyari": { x: 2, y: 3 },
      "Korangi": { x: 5, y: 6 },
      "Gulshan": { x: 3, y: 2 },
      "Nazimabad": { x: 6, y: 1 },
      "Orangi": { x: 7, y: 4 },
      "SITE": { x: 8, y: 3 },
      "North Nazimabad": { x: 5, y: 1 },
      "Malir": { x: 1, y: 7 },
      "Clifton": { x: 4, y: 5 },
      "Saddar": { x: 3, y: 4 }
      // Add more as needed
    };

    const now = new Date();
    const rangeMs = {
      day: 1, week: 7, month: 30, year: 365
    }[range] * 24 * 60 * 60 * 1000;

    const filtered = allIncidents.filter(inc => {
      if (type !== 'incidents' && inc.category.toLowerCase() !== type.toLowerCase()) return false;
      const d = new Date(inc.date);
      return !isNaN(d) && (now - d) < rangeMs;
    });

    const heatmap = Array.from({ length: 10 }, (_, x) =>
      Array.from({ length: 10 }, (_, y) => ({ x, y, value: 0 }))
    ).flat();

    filtered.forEach(inc => {
      const town = inc.town;
      const cell = townGridMap[town];
      if (cell) {
        const gridCell = heatmap.find(c => c.x === cell.x && c.y === cell.y);
        if (gridCell) gridCell.value += 1;
      }
    });

    res.json(heatmap);
  } catch (err) {
    console.error('Heatmap error:', err);
    res.status(500).json({ error: 'Error generating heatmap' });
  }
});

// ADMIN LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || admin.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/api/users");
    
    // Normalize response
    const users = Array.isArray(response.data)
      ? response.data
      : response.data.users || [];

    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users from user panel:", err.message);
    res.status(500).json({ error: "Internal server error while fetching users" });
  }
});

app.get("/api/admin-info", async (req, res) => {
  try {
    const admin = await Admin.findOne({}, "-password");
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch admin info" });
  }
});


// TEST Protected Route
app.get("/api/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "Access granted", user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Admin Backend running on port ${PORT}`);
});
