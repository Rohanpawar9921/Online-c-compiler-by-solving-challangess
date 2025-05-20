# 📋 Hosting Guide for Coding Challenge Platform

This guide will walk you through deploying your Coding Challenge Platform to production using free tiers of popular cloud services.

## 1️⃣ Database: MongoDB Atlas

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Build a Database"
3. Select the FREE tier and your preferred cloud provider (AWS/Google Cloud/Azure)
4. Choose a region close to your target users
5. Name your cluster (e.g., "CodingChallengeDB")
6. Click "Create"
7. Create a database user:
   - In the security tab, click "Database Access" → "Add New Database User"
   - Create a username and strong password
   - Set permissions to "Read and Write to Any Database"
8. Set up network access:
   - In "Network Access" tab, click "Add IP Address"
   - Choose "Allow Access from Anywhere" for now (you can restrict this later)
9. Get your connection string:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string and replace `<password>` with your actual password
   - Add the database name to the connection string by inserting `/coding-challenge-db` before the `?` character
   - Your final connection string should look like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/coding-challenge-db?retryWrites=true&w=majority`

## 2️⃣ Backend: Render.com

1. Create a Render account at [render.com](https://render.com)
2. Push your project to GitHub if you haven't already
3. In Render dashboard, select "New" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - Name: "coding-challenge-api" (or whatever you prefer)
   - Root Directory: `/backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node index.js`
6. Add Environment Variables:
   - `MONGO_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = A secure random string (generate one at [passwordsgenerator.net](https://passwordsgenerator.net/))
   - No need to set PORT as Render handles this automatically
7. Select "Free" plan and click "Create Web Service"
8. Wait for deployment to complete and note your service URL (e.g., `https://coding-challenge-api.onrender.com`)

## 3️⃣ Frontend: Netlify

1. Create a Netlify account at [netlify.com](https://netlify.com)
2. From your dashboard, click "Add new site" → "Import an existing project"
3. Connect to your GitHub repository
4. Configure the build:
   - Base directory: `/frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
5. Add environment variable:
   - `REACT_APP_API_URL` = Your Render backend URL (from step 2)
6. Click "Deploy site"
7. Once deployed, you can set up a custom domain if desired

## 4️⃣ Final Steps

1. Update your frontend `config.js` with the actual backend URL
2. Test your application end-to-end
3. Update CORS settings in backend to only allow your Netlify domain
4. Consider setting up CI/CD for automatic deployments on code updates

## 🔒 Security Considerations

- Restrict MongoDB Atlas IP access to only your backend service
- Consider adding rate limiting to API endpoints
- Ensure your JWT secret is strong and not committed to code
- Set proper CORS headers to prevent unauthorized access

## 💡 Troubleshooting

- If API calls fail, check CORS configuration
- For MongoDB connection issues, verify your IP is whitelisted
- If Docker compilation fails, ensure Render has sufficient resources
