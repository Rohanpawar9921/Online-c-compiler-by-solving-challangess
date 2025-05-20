// test-db-connection.js
// Script to test MongoDB connection directly

const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection');
console.log('============================');

// Use the exact same connection string you'll use in production
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rohanpawar3307:XKC6s6Gr7xX9Ryzv@cluster0.0usljpu.mongodb.net/coding-challenge-db?retryWrites=true&w=majority&appName=Cluster0';

// Log the (sanitized) connection string 
console.log('Connection string (sanitized):', MONGO_URI.replace(/:([^@]+)@/, ':***@'));

// Connection options
const options = {
  serverSelectionTimeoutMS: 5000, 
};

// Connect to MongoDB
mongoose.connect(MONGO_URI, options)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected');
    
    // Check if we can access collections
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    if (collections.length === 0) {
      console.log('⚠️ Database is empty (no collections found)');
    } else {
      console.log('📊 Collections in database:');
      collections.forEach(collection => console.log(`  - ${collection.name}`));
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Error details:', err);
  })
  .finally(() => {
    // Close the connection
    mongoose.connection.close()
      .then(() => console.log('Connection closed'))
      .catch(err => console.error('Error closing connection:', err))
      .finally(() => process.exit(0));
  });
