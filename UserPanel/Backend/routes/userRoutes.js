// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/users — fetch all users (no passwords)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ msg: "Error fetching users" });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ msg: "Server error while deleting user" });
  }
});

module.exports = router;
