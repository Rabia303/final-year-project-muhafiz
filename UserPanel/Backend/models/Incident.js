const mongoose = require('mongoose');
const incidentSchema = new mongoose.Schema({
    title: String,
    description: String,
    town: String,
    subdivision: String,
    category: String,
    urgency: String,
    date: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    incidentTime: String,
    location: String,
    severity: String,
    zone: String,
    isAnonymous: Boolean,
    tags: [String],
    witnessCount: String,
    suspectInfo: String,
    reportedToPolice: String,
    images: [String],
    videos: [String],
    audios: [String],
});

module.exports = mongoose.model("Incident", incidentSchema);
