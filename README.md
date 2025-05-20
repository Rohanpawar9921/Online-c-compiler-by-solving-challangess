# 💻 Coding Challenge Platform

A full-stack web application that allows users to browse coding challenges, write and compile code in an in-browser editor, and track their progress.

## 🌐 Live Demo

**Live Website:** [Coding Challenge Platform](https://taupe-eclair-60496b.netlify.app/)

> **Note:** The code execution feature is currently disabled as Docker hosting requires a paid plan on Render.com. We are working on implementing an alternative solution and will enable this feature soon. The platform can still be explored with all other features.

## 🚀 Features

- 🧩 Browse coding challenges with difficulty levels
- 💡 In-browser C code editor and compiler
- 🔒 Authentication system using JWT
- 📊 Progress tracking
- 🌟 Badge system for achievements

## 🛠️ Tech Stack

**Frontend:**
- JavaScript (JS)
- React.js
- Bootstrap
- Axios
- Monaco Editor

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT (Authentication)
- Docker (for code execution)

## 🚀 Deployment

The application is deployed using:
- Backend: [Render.com](https://render.com)
- Frontend: [Netlify](https://netlify.com)
- Database: [MongoDB Atlas](https://mongodb.com/atlas)

### Deployment Instructions

#### Backend (Render.com)

1. Run the deployment script:
   ```
   .\deploy-render-fixed.ps1
   ```

2. The script will:
   - Test your MongoDB connection
   - Set up environment variables
   - Push your changes to GitHub
   - Give you instructions for completing deployment on Render.com

3. On Render.com:
   - Connect your GitHub repository
   - Verify environment variables are set:
     - MONGO_URI
     - JWT_SECRET
     - NODE_ENV=production
     - ALLOWED_ORIGINS=*
   - Build command: `npm install`
   - Start command: `node index.js`

#### Frontend (Netlify)

1. After the backend is deployed, run:
   ```
   .\deploy-netlify.ps1
   ```

2. The script will:
   - Update the API URL in your frontend
   - Build the React application
   - Deploy to Netlify
   - Push your changes to GitHub

## 📂 Project Structure

```bash
backend/
├── models/
│ ├── Badge.js
│ ├── Challenge.js
│ ├── Progress.js
│ └── User.js
├── routes/
│ ├── challanges.js
│ ├── progress.js
├── seed.js
├── index.js
├── .env
├── Dockerfile
├── package.json

frontend/
├── src/
│ ├── components/
│ │ ├── AuthForm.js
│ │ ├── ChallengeBrowser.js
│ │ ├── Compiler.js
│ │ └── ProgressDashboard.js
│ ├── context/
│ │ └── AuthContext.js
│ ├── styles/
│ │ └── components.css
│ ├── App.js
│ ├── index.js
├── public/
├── package.json

```
## ⚙️ Running Locally

1. **Clone the repository**

```bash
git clone https://github.com/your-username/coding-challenge-platform.git
cd coding-challenge-platform
Set up the backend

cd backend
npm install
node seed.js  # (Optional) Seed sample challenges
npm start
Set up the frontend


cd frontend
npm install
npm start

```


 # Create .env file in backend

 ```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/coding-challenge-db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

## 🚀 Deployment

For deployment instructions, see [HOSTING.md](./HOSTING.md). You can also run:

```bash
node deploy-to-render.js
```

This will provide step-by-step instructions for setting up environment variables on Render.com.


🚧 Feature Under Construction

📌 The Progress Tracking feature is under development.

💬 We're open to contributions!
If you're interested in implementing this feature or want to improve any part of the project, feel free to fork, contribute, or create issues. Let's build it together! 🚀

## 🌐 Hosting Guide

Detailed instructions for hosting this project are available in the [HOSTING.md](./HOSTING.md) file. 
For a quick setup, run:

```bash
node deploy.js
```

## 🤝 Help and Support

This project is actively seeking help to improve the code execution feature. Current challenges:

- The backend code execution relies on Docker, which requires a paid plan on Render.com
- We're exploring alternatives like Judge0 API or other code execution services
- If you have expertise in this area and would like to contribute, please reach out!

## 👨‍💻 About the Developer

This project was developed by Rohan Pawar as part of an internship project. 

## 📝 License

This project is open source and available under the MIT License.

This script will guide you through the deployment process to MongoDB Atlas, Render.com, and Netlify.

🧑‍💻 Author - 
Rohan Pawar
