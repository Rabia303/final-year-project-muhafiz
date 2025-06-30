const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true }
});

module.exports = mongoose.model('Resource', resourceSchema);
