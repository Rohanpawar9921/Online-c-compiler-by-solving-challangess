const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  icon: String,
  condition: {
    type: String,
    enum: ['challengesCompleted', 'streak'],
    required: true
  },
  threshold: { type: Number, required: true }
});

module.exports = mongoose.model('Badge', badgeSchema);
