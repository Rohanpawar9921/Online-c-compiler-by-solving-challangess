// render-setup.js
// Script to set up and test deployment on Render.com

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Render.com Deployment Helper');
console.log('==============================');

// Check if environment variables are set correctly
console.log('\n📋 Environment Variables Check:');
const envVars = {
  'MONGO_URI': process.env.MONGO_URI || 'Not set',
  'JWT_SECRET': process.env.JWT_SECRET ? 'Set (hidden)' : 'Not set',
  'NODE_ENV': process.env.NODE_ENV || 'Not set',
  'PORT': process.env.PORT || 'Not set'
};

Object.keys(envVars).forEach(key => {
  const value = envVars[key];
  if (value === 'Not set') {
    console.log(`  ❌ ${key}: Not set (will use default)`);
  } else {
    if (key === 'MONGO_URI') {
      // Hide credentials
      const maskedValue = value.includes('@') 
        ? value.replace(/:([^@]+)@/, ':***@') 
        : 'Invalid format';
      console.log(`  ✅ ${key}: ${maskedValue}`);
    } else {
      console.log(`  ✅ ${key}: ${value}`);
    }
  }
});

// Create a .env.production file if it doesn't exist (for direct use on Render)
const envProductionPath = path.join(__dirname, '.env.production');
if (!fs.existsSync(envProductionPath)) {
  console.log('\n📝 Creating .env.production file...');
  const envContent = `
MONGO_URI=mongodb+srv://rohanpawar3307:XKC6s6Gr7xX9Ryzv@cluster0.0usljpu.mongodb.net/coding-challenge-db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=coding-challenge-jwt-secret-key-2024-secure
NODE_ENV=production
ALLOWED_ORIGINS=*
  `.trim();
  
  fs.writeFileSync(envProductionPath, envContent);
  console.log('  ✅ .env.production file created');
  console.log('  🔒 This file should not be committed to version control');
}

// Test the database connection
console.log('\n🔍 Testing database connection...');
try {
  execSync('node test-db-connection.js', { stdio: 'inherit' });
} catch (error) {
  console.error('  ❌ Database connection test failed');
}

// Provide instructions for Render.com
console.log('\n🌐 Render.com Setup Instructions:');
console.log('  1. Make sure your code is pushed to GitHub');
console.log('  2. Go to render.com and create a new Web Service');
console.log('  3. Connect to your GitHub repository');
console.log('  4. Set the build command to: npm install');
console.log('  5. Set the start command to: node index.js');
console.log('  6. Add the following environment variables:');
console.log('     - MONGO_URI: mongodb+srv://rohanpawar3307:XKC6s6Gr7xX9Ryzv@cluster0.0usljpu.mongodb.net/coding-challenge-db?retryWrites=true&w=majority&appName=Cluster0');
console.log('     - JWT_SECRET: coding-challenge-jwt-secret-key-2024-secure');
console.log('     - NODE_ENV: production');
console.log('     - ALLOWED_ORIGINS: *');
console.log('  7. Deploy your service');

console.log('\n✅ Setup complete!');
console.log('You can now push your changes to GitHub and deploy on Render.com');
