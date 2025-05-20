const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['basic', 'intermediate', 'advanced'],
    required: true
  },
  testCases: [{
    input: String,
    output: String,
    hidden: Boolean
  }],
  starterCode: { type: String, default: '' },
  category: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Challenge', challengeSchema);