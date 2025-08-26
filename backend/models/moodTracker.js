const mongoose = require("mongoose");

const moodTracker = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String, 
    required: true
  },
  responses: {
    happy: { type: Number, default: 0 },
    joyful: { type: Number, default: 0 },
    content: { type: Number, default: 0 },
    relaxed: { type: Number, default: 0 },
    loved: { type: Number, default: 0 },
    valued: { type: Number, default: 0 },
    proud: { type: Number, default: 0 },
    grateful: { type: Number, default: 0 },
    productive: { type: Number, default: 0 },
    motivated: { type: Number, default: 0 },
    alive: { type: Number, default: 0 },
    excited: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    lonely: { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
    anxious: { type: Number, default: 0 },
    tired: { type: Number, default: 0 },
    sick: { type: Number, default: 0 },
    bored: { type: Number, default: 0 },
    lazy: { type: Number, default: 0 }
  },
  analyzed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

moodTracker.index({ userId: 1, date: 1 }, { unique: true });

const MoodTracker = mongoose.model('MoodTracker', moodTracker);
module.exports = MoodTracker;
