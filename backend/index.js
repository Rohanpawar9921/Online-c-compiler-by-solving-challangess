// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const Docker = require('dockerode');
const { tmpdir } = require('os');
const { mkdtemp, writeFile, readFile } = require('fs/promises');
const { join } = require('path');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const Challenge = require("./models/Challenge");
const Progress = require("./models/Progress");
const Badge = require("./models/Badge");
const fs = require('fs');
const path = require('path');

// Load .env file if it exists
const dotenvPath = path.resolve(__dirname, '.env');
if (fs.existsSync(dotenvPath)) {
  console.log('.env file found, loading configuration...');
  require('dotenv').config();
} else {
  console.log('.env file not found, relying on environment variables...');
}

// Import routes
const progressRoutes = require('./routes/progress');
const challengesRoutes = require('./routes/challenges');
const { getCorsOptions } = require('./cors-config');

const JWT_SECRET = process.env.JWT_SECRET;

// Log all environment variables for debugging (except sensitive ones)
console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET set:', process.env.JWT_SECRET ? 'Yes' : 'No');
console.log('MONGO_URI set:', process.env.MONGO_URI ? 'Yes' : 'No');
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS);

// Log the MongoDB URI (but hide credentials)
const mongoUriForLogging = process.env.MONGO_URI 
  ? process.env.MONGO_URI.replace(/:([^@]+)@/, ':***@') 
  : "mongodb://localhost:27017/coding-challenge-db";
console.log('Attempting to connect to MongoDB:', mongoUriForLogging);

// Hardcode the MongoDB Atlas connection string as a fallback
const ATLAS_URI = "mongodb+srv://rohanpawar3307:XKC6s6Gr7xX9Ryzv@cluster0.0usljpu.mongodb.net/coding-challenge-db?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_URI = process.env.MONGO_URI || ATLAS_URI;

console.log('Using connection string (masked):', MONGO_URI.replace(/:([^@]+)@/, ':***@'));

// Set Mongoose connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// Try to use the config file for MongoDB connection
const config = require('./config');
console.log('Using MongoDB connection from config:', config.MONGODB.URI.replace(/:([^@]+)@/, ':***@'));

mongoose.connect(config.MONGODB.URI, config.MONGODB.options)
  .then(() => console.log('MongoDB connected successfully via config'))
  .catch(err => {
    console.error('MongoDB connection error with config:', err.message);
    console.error('Trying direct connection as fallback...');
    
    // Fallback to direct connection
    return mongoose.connect(MONGO_URI, mongooseOptions);
  })
  .then(() => {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB connection established successfully!');
    }
  })
  .catch(err => {
    console.error('All MongoDB connection attempts failed:', err.message);
    console.error('Please check your MONGO_URI environment variable');
  });

const app = express();
const docker = new Docker();

app.use(cors(getCorsOptions()));
app.use(bodyParser.json());

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: "Too many attempts, please try again in a minute."
});

app.use("/login", authLimiter);
app.use("/register", authLimiter);
     
// Use routes - make sure this appears before your app.listen() call
app.use('/api/progress', progressRoutes);
app.use('/api/challenges', challengesRoutes);

// Health check endpoint for Render.com
app.get('/api/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  res.status(200).json(health);
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    res.status(400).json({ error: "Registration failed (email may exist)" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await user.comparePassword(req.body.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, config.JWT.secret, { expiresIn: config.JWT.expiresIn });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, config.JWT.secret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.get('/api/challenges', async (req, res) => {
  try {
    const challenges = await Challenge.find().select('-testCases.hidden');
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/challenges/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/progress', authenticate, async (req, res) => {
  const { challengeId, passed } = req.body;

  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      {
        $push: { challengesCompleted: { challengeId, passed } },
        $inc: { streak: passed ? 1 : -1 },
        lastActive: new Date()
      },
      { new: true, upsert: true }
    );

    const unlockedBadges = await checkBadgeUnlocks(req.userId);
    res.json({ progress, unlockedBadges });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const checkBadgeUnlocks = async (userId) => {
  const progress = await Progress.findOne({ userId });
  const badges = await Badge.find();
  const user = await User.findById(userId);

  const unlocked = badges.filter(badge => {
    const { condition, threshold } = badge;
    if (condition === 'challengesCompleted') {
      return progress.challengesCompleted.length >= threshold;
    }
    if (condition === 'streak') {
      return progress.streak >= threshold;
    }
    return false;
  });

  const newBadgeIds = unlocked.map(b => b._id).filter(id => !user.badges.includes(id));

  if (newBadgeIds.length > 0) {
    user.badges.push(...newBadgeIds);
    await user.save();
  }

  return unlocked;
};

app.get('/api/badges', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('badges');
    res.json(user.badges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/compile', authenticate, async (req, res) => {
  const { code, stdin = '' } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No code provided.' });
  }

  try {
    const tmpDir = await mkdtemp(join(tmpdir(), 'c-compile-'));

    const codePath = join(tmpDir, 'code.c');
    const stdinPath = join(tmpDir, 'stdin.txt');
    const outputPath = join(tmpDir, 'output.txt');
    const errorPath = join(tmpDir, 'error.txt');

    await Promise.all([
      writeFile(codePath, code),
      writeFile(stdinPath, stdin),
      writeFile(outputPath, ''),
      writeFile(errorPath, '')
    ]);

    const container = await docker.createContainer({
      Image: 'gcc-sandbox',
      HostConfig: {
        AutoRemove: true,
        Memory: 100 * 1024 * 1024,
        NetworkMode: 'none',
        Binds: [
          `${tmpDir}:/code`
        ],
      },
      WorkingDir: '/code',
      Cmd: ['sh', '-c', `
        gcc code.c -o code.out &&
        timeout 5s ./code.out < stdin.txt > output.txt 2> error.txt
      `],
    });

    await container.start();
    await container.wait();

    const [stdout, stderr] = await Promise.all([
      readFile(outputPath, 'utf8'),
      readFile(errorPath, 'utf8')
    ]);

    res.json({
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      exit_code: 0,
    });

  } catch (error) {
    res.status(500).json({ stderr: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
