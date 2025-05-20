#!/usr/bin/env node

/**
 * Deployment helper script for Coding Challenge Platform
 * 
 * This script helps prepare your project for deployment to 
 * Render.com and Netlify
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Root directory of the project
const rootDir = path.resolve(__dirname);
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log('🚀 Coding Challenge Platform Deployment Helper');
console.log('==============================================\n');

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

async function updateBackendUrl() {
  const configPath = path.join(frontendDir, 'src', 'config.js');
  const content = fs.readFileSync(configPath, 'utf8');
  
  const backendUrl = await askQuestion('Enter your Render.com backend URL (e.g., https://coding-challenge-api.onrender.com): ');
  
  const updatedContent = content.replace(
    /https:\/\/your-backend-url\.onrender\.com/,
    backendUrl
  );
  
  fs.writeFileSync(configPath, updatedContent);
  console.log('✅ Backend URL updated in config.js');
}

async function updateCorsConfig() {
  const corsPath = path.join(backendDir, 'cors-config.js');
  const content = fs.readFileSync(corsPath, 'utf8');
  
  const frontendUrl = await askQuestion('Enter your Netlify frontend URL (e.g., https://your-app.netlify.app): ');
  
  // Add the frontend URL to allowed origins
  let updatedContent = content;
  if (!content.includes(frontendUrl)) {
    updatedContent = content.replace(
      /origin: process\.env\.ALLOWED_ORIGINS/,
      `origin: process.env.ALLOWED_ORIGINS // Includes ${frontendUrl}`
    );
  }
  
  fs.writeFileSync(corsPath, updatedContent);
  console.log('✅ CORS configuration updated');
}

async function runApiUrlUpdater() {
  const scriptPath = path.join(frontendDir, 'update-api-urls.js');
  
  try {
    console.log('Running API URL updater...');
    execSync('node ' + scriptPath, { stdio: 'inherit' });
    console.log('✅ API URLs updated in components');
  } catch (error) {
    console.error('❌ Failed to update API URLs:', error.message);
  }
}

async function buildFrontend() {
  try {
    console.log('Building frontend...');
    execSync('cd ' + frontendDir + ' && npm run build', { stdio: 'inherit' });
    console.log('✅ Frontend built successfully');
  } catch (error) {
    console.error('❌ Failed to build frontend:', error.message);
  }
}

async function remindEnvironmentVariables() {
  console.log('\n🔐 Remember to set these environment variables on Render.com:');
  console.log('- MONGO_URI: Your MongoDB Atlas connection string');
  console.log('- JWT_SECRET: A secure random string');
  console.log('- NODE_ENV: production');
  console.log('- ALLOWED_ORIGINS: Your Netlify app URL (comma-separated if multiple)');
}

async function main() {
  try {
    await updateBackendUrl();
    await updateCorsConfig();
    await runApiUrlUpdater();
    
    const shouldBuild = await askQuestion('Do you want to build the frontend now? (y/n): ');
    if (shouldBuild.toLowerCase() === 'y') {
      await buildFrontend();
    }
    
    await remindEnvironmentVariables();
    
    console.log('\n🎉 Your project is ready for deployment!');
    console.log('1. Push these changes to your GitHub repository');
    console.log('2. Deploy the backend to Render.com');
    console.log('3. Deploy the frontend to Netlify');
    console.log('4. Check the HOSTING.md file for detailed instructions');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
}

main();
