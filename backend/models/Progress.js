const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  challengesCompleted: [{
    challengeId: mongoose.Schema.Types.ObjectId,
    passed: Boolean
  }],
  streak: { type: Number, default: 0 },
  lastActive: Date
});

module.exports = mongoose.model('Progress', progressSchema);