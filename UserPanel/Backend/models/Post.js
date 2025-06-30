const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: { type: String, default: "Community Member" },
  text: { type: String, required: true },
  location: String,
  media: {
    url: String,
    type: String
  },
  reactions: {
    type: Map,
    of: [String],
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  replies: []
}, { _id: false });

const postSchema = new mongoose.Schema({
  message: { type: String, required: true },
  emotion: String,
  location: String,
  tags: [String],
  isAnonymous: { type: Boolean, default: false },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },

  media: [
    {
      url: { type: String },
      type: { type: String, enum: ['image', 'video', 'audio'] }
    }
  ],

  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscussionChannel',
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  reactions: {
    type: Map,
    of: [String],
    default: {}
  },

  replies: {
    type: [replySchema],
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
