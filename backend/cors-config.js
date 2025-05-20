// cors-config.js
// This file configures CORS for different environments

const corsOptions = {
  development: {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
  },  production: {
    // Replace with your actual frontend URL after deployment
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').filter(origin => origin.trim() !== '')
      : ['https://your-netlify-app.netlify.app', 'https://yourdomain.com'],
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
