const mongoose = require('mongoose');

const forumTopicSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  posts: { type: Number, default: 0 },
  lastActive: { type: String, required: true }
});

module.exports = mongoose.model('ForumTopic', forumTopicSchema);
