// This file handles API configuration for both development and production
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://coding-challenge-backend-jjd1.onrender.com' // Production URL 
    : 'http://localhost:5000'); // Default development URL

// For debugging purposes
console.log(`Using API URL: ${API_URL}`);
console.log(`Environment: ${process.env.NODE_ENV}`);

export default API_URL;
