# Deploying to Render.com

This document provides detailed instructions for deploying the backend of the Coding Challenge Platform to Render.com.

## Prerequisites

- GitHub repository with your code
- Render.com account
- MongoDB Atlas account with a database set up

## Deployment Steps

### 1. Prepare Your Code

Before deploying, make sure your code is ready:

- Run the deployment script: `.\deploy-render-fixed.ps1`
- This script will test your MongoDB connection and push changes to GitHub

### 2. Create a Web Service on Render.com

1. Log in to your [Render.com dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect to your GitHub repository
4. Configure the service:
   - **Name**: `coding-challenge-backend` (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Region**: Choose a region close to your users
   - **Plan**: Select the Free plan (or upgrade if needed)

### 3. Set Environment Variables

1. In your web service settings, go to the "Environment" tab
2. Add the following variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string 
     - Example: `mongodb+srv://username:password@cluster0.example.mongodb.net/db-name?retryWrites=true&w=majority`
   - `JWT_SECRET`: A secret key for JWT token generation 
     - Example: `coding-challenge-jwt-secret-key-2024-secure`
   - `NODE_ENV`: Set to `production`
   - `ALLOWED_ORIGINS`: Set to `*` initially, then update to your frontend URL

### 4. Deploy

1. Click "Manual Deploy" > "Clear build cache & deploy"
2. Monitor the logs for any errors
3. Wait for the deployment to complete
4. Your API will be available at `https://your-service-name.onrender.com`

### 5. Test Your Deployment

1. Test the health endpoint: `https://your-service-name.onrender.com/api/health`
2. If it returns a status of "OK", your deployment is successful

## Troubleshooting

### MongoDB Connection Issues

If your API can't connect to MongoDB:

1. Double-check your `MONGO_URI` environment variable
2. Ensure your MongoDB Atlas cluster allows connections from all IPs (0.0.0.0/0)
3. Check the logs in Render.com for specific error messages

### Deployment Failures

If your deployment fails:

1. Check the build logs for errors
2. Ensure all dependencies are properly specified in package.json
3. Make sure the start command is correct

## Scaling

The free tier of Render.com has some limitations:

- Services spin down after 15 minutes of inactivity
- Limited resources (CPU and RAM)

If your application needs more resources, consider upgrading to a paid plan.

## Next Steps

After deploying your backend, deploy the frontend to Netlify using the provided script: `.\deploy-netlify.ps1`
