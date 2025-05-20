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
require('dotenv').config();
// Import routes
const progressRoutes = require('./routes/progress');
const challengesRoutes = require('./routes/challenges');

const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/compiler-app");

const app = express();
const docker = new Docker();

app.use(cors());
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
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

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
