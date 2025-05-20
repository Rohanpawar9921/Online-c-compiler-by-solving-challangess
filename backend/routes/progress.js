const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Badge = require('../models/Badge');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ----------------------
// 🔐 AUTHENTICATION MIDDLEWARE
// ----------------------
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ----------------------
// 🏅 HELPER FUNCTION: AWARD BADGES
// ----------------------
async function awardBadges(userId, badges) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const existingBadgeIds = user.badges.map(b => b.toString());
  const newBadgeIds = badges
    .map(b => b._id.toString())
    .filter(id => !existingBadgeIds.includes(id));

  user.badges.push(...newBadgeIds);
  await user.save();
}

// ----------------------
// 🚀 POST: Save Progress & Award Badges
// ----------------------
router.post('/', authenticate, async (req, res) => {
  const { challengeId, passed } = req.body;
  const userId = req.userId;

  try {
    let progress = await Progress.findOne({ userId });

    if (!progress) {
      // New user progress
      progress = await Progress.create({
        userId,
        challengesCompleted: [{ challengeId, passed }],
        streak: passed ? 1 : 0,
        lastActive: new Date(),
      });
    } else {
      // Update existing progress
      const existing = progress.challengesCompleted.find(
        (c) => c.challengeId.toString() === challengeId.toString()
      );

      if (existing) {
        existing.passed = passed;
      } else {
        progress.challengesCompleted.push({ challengeId, passed });
      }

      progress.streak = passed ? progress.streak + 1 : 0;
      progress.lastActive = new Date();
      await progress.save();
    }

    // Award eligible badges
    const badges = await Badge.find();
    const eligibleBadges = badges.filter((badge) => {
      if (badge.condition === 'challengesCompleted') {
        return progress.challengesCompleted.length >= badge.threshold;
      } else if (badge.condition === 'streak') {
        return progress.streak >= badge.threshold;
      }
      return false;
    });

    if (eligibleBadges.length > 0) {
      await awardBadges(userId, eligibleBadges);
    }

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ----------------------
// 📊 GET: User Progress with Challenge Details
// ----------------------
router.get('/user-progress', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.userId });

    if (!progress) {
      return res.json({
        challengesCompleted: [],
        streak: 0,
        lastActive: null
      });
    }

    const challengeIds = progress.challengesCompleted.map(c => c.challengeId);
    const challenges = await Challenge.find({ _id: { $in: challengeIds } });

    const completedChallengesWithDetails = progress.challengesCompleted.map(completed => {
      const challenge = challenges.find(c => c._id.toString() === completed.challengeId.toString());
      return {
        ...completed._doc,
        challengeDetails: challenge || null
      };
    });

    res.json({
      ...progress._doc,
      challengesCompleted: completedChallengesWithDetails
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
