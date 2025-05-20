# 💻 Coding Challenge Platform

A full-stack web application that allows users to browse coding challenges, write and compile code in an in-browser editor, and track their progress (feature in progress).

## 🚀 Features

- 🧩 Browse coding challenges with difficulty levels.
- 💡 In-browser C code editor and compiler .
- 🔒 Authentication system using JWT.
- 📊 Progress tracking **(in development — open to contributions)**

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

This script will guide you through the deployment process to MongoDB Atlas, Render.com, and Netlify.

🧑‍💻 Author - 
Rohan Pawar
