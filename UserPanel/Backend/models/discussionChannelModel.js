const mongoose = require('mongoose');

const discussionChannelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  area: String,
  imageUrl: String,
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  category: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('DiscussionChannel', discussionChannelSchema);
