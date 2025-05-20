const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// models/User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }]
});

// Add password hashing and comparison methods
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();  // Prevent hashing if password is not modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
