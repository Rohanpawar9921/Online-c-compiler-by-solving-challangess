// This file handles API configuration for both development and production
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://coding-challenge-backend.onrender.com' // Replace with your actual backend URL after deployment
  : 'http://localhost:5000';

export default API_URL;
