// cors-config.js
// This file configures CORS for different environments

const corsOptions = {
  development: {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
  },  production: {
    // In production, we use the ALLOWED_ORIGINS env var, or allow all ('*') during initial setup
    origin: process.env.ALLOWED_ORIGINS === '*' 
      ? '*'
      : process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',').filter(origin => origin.trim() !== '')
        : ['https://coding-challenge-platform.netlify.app'],
    credentials: true,
    optionsSuccessStatus: 200
  }
};

// Get environment-specific CORS options
const getCorsOptions = () => {
  const env = process.env.NODE_ENV || 'development';
  return corsOptions[env];
};

module.exports = { getCorsOptions };
