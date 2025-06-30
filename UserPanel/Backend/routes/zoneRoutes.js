const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET /api/zones?zone=RED&town=Lyari Town
router.get("/", async (req, res) => {
  try {
    const { zone, town } = req.query;

    // Build query string for Flask
    let queryString = "";
    if (zone) queryString += `zone=${zone}&`;
    if (town) queryString += `town=${encodeURIComponent(town)}&`;

    const flaskUrl = `http://localhost:5001/get-zone-data?${queryString}`;

    const response = await axios.get(flaskUrl);
    res.json(response.data);
  } catch (error) {
    console.error("Flask API error:", error.message);
    res.status(500).json({ error: "Failed to fetch zone data" });
  }
});

module.exports = router;
