const express = require('express');
const ForumTopic = require('../models/ForumTopic');
const Resource = require('../models/Resource');
const router = express.Router();

// --- Forum Topics ---
router.get('/topics', async (req, res) => {
  const topics = await ForumTopic.find().sort({ lastActive: -1 });
  res.json(topics);
});

router.post('/topics', async (req, res) => {
  const topic = new ForumTopic(req.body);
  await topic.save();
  res.status(201).json(topic);
});

// --- Resources ---
router.get('/resources', async (req, res) => {
  const resources = await Resource.find();
  res.json(resources);
});

router.post('/resources', async (req, res) => {
  const resource = new Resource(req.body);
  await resource.save();
  res.status(201).json(resource);
});

module.exports = router;
