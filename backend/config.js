// config.js
// Centralized configuration file for the application

// MongoDB connection settings
const MONGODB = {
  URI: process.env.MONGO_URI || 'mongodb+srv://rohanpawar3307:XKC6s6Gr7xX9Ryzv@cluster0.0usljpu.mongodb.net/coding-challenge-db?retryWrites=true&w=majority&appName=Cluster0',
  options: {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

// Server settings
const SERVER = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
};

// JWT configuration
const JWT = {
  secret: process.env.JWT_SECRET || 'default-development-secret-do-not-use-in-production',
  expiresIn: '1h',
};

// Export all configurations
module.exports = {
  MONGODB,
  SERVER,
  JWT,
};
