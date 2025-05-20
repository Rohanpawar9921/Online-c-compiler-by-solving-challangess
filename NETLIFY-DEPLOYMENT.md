# Deploying to Netlify

This document provides detailed instructions for deploying the frontend of the Coding Challenge Platform to Netlify.

## Prerequisites

- GitHub repository with your code
- Netlify account
- Backend already deployed to Render.com with a valid URL

## Deployment Steps

### 1. Prepare Your Frontend

Before deploying, make sure your frontend is configured to use the correct backend URL:

1. Update the API_URL in `frontend/src/config.js` to point to your Render.com backend:
   ```javascript
   const API_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-backend-url.onrender.com' // Use your actual backend URL
     : 'http://localhost:5000';
   ```

2. Make sure all components are using this API_URL for API calls. The following components should be checked:
   - AuthForm.js
   - ChallengeBrowser.js
   - Compiler.js
   - ProgressDashboard.js

### 2. Deploy Using the Script

The easiest way to deploy is using the provided PowerShell script:

1. Open PowerShell
2. Navigate to your project directory
3. Run the deployment script:
   ```powershell
   .\deploy-netlify.ps1
   ```

4. When prompted, enter your deployed backend URL (e.g., https://coding-challenge-backend.onrender.com)
5. Follow the Netlify CLI prompts to complete the deployment

### 3. Manual Deployment to Netlify

If you prefer to deploy manually:

1. Build your React application:
   ```
   cd frontend
   npm run build
   ```

2. Deploy to Netlify using one of these methods:

   a. Netlify CLI:
   ```
   npm install -g netlify-cli
   netlify deploy --prod
   ```

   b. Netlify Drop:
   - Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop your `build` folder

   c. Netlify Git Integration:
   - Connect your GitHub repository to Netlify
   - Configure the build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
     - Deploy trigger: Choose automatic or manual

### 4. Configure Netlify Settings

After deployment, configure the following settings in your Netlify dashboard:

1. **Domain Settings**: Set up a custom domain if desired

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `build`

3. **Environment Variables**:
   - `REACT_APP_API_URL`: Your backend URL on Render.com

4. **Deploy Settings**:
   - Configure deploy contexts if needed
   - Enable branch deploys if using CI/CD

### 5. Configure Redirects

Ensure your Netlify site handles client-side routing correctly by adding a `_redirects` file in your `public` folder with:

```
/*    /index.html   200
```

Alternatively, use the existing `netlify.toml` file which already contains the necessary redirect rules.

## Testing Your Deployment

1. Visit your Netlify URL
2. Test the following features:
   - User registration and login
   - Browsing challenges
   - Running code in the compiler
   - Viewing progress dashboard

## Troubleshooting

### CORS Issues

If you experience CORS issues:

1. Verify your backend's CORS settings in `cors-config.js`
2. Make sure your frontend's API calls include the correct URL
3. Check that your backend's ALLOWED_ORIGINS environment variable includes your Netlify domain

### API Connection Issues

If the frontend can't connect to your backend:

1. Check the browser console for error messages
2. Verify the API_URL in config.js is correct
3. Make sure your backend is running and accessible

### Netlify Build Failures

If your Netlify build fails:

1. Check the build logs for specific error messages
2. Verify your package.json dependencies
3. Ensure your build command works locally

## Next Steps

After successfully deploying to Netlify:

1. Set up a custom domain if desired
2. Configure HTTPS
3. Set up CI/CD for automatic deployments
4. Implement monitoring and analytics
