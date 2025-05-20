// deploy-to-render.js
// This script helps with setting up environment variables manually on Render.com

console.log('📋 Render.com Environment Variable Setup Guide');
console.log('==============================================');
console.log('\n1. Go to your Render.com dashboard');
console.log('2. Click on your web service (coding-challenge-backend)');
console.log('3. Click on "Environment" in the left sidebar');
console.log('4. Add the following environment variables exactly as shown:\n');

console.log('Key: MONGO_URI');
console.log('Value: mongodb+srv://rohanpawar3307:XKC6s6Gr7xX9Ryzv@cluster0.0usljpu.mongodb.net/coding-challenge-db?retryWrites=true&w=majority&appName=Cluster0');
console.log('\nKey: JWT_SECRET');
console.log('Value: [Generate a secure random string or use:] coding-challenge-jwt-secret-key-2024-secure');
console.log('\nKey: NODE_ENV');
console.log('Value: production');
console.log('\nKey: ALLOWED_ORIGINS');
console.log('Value: *');
console.log('\n5. Click "Save Changes"');
console.log('6. Go to the "Manual Deploy" section');
console.log('7. Select "Clear build cache & deploy"');
console.log('\nYour deployment should now connect to MongoDB Atlas successfully!');
