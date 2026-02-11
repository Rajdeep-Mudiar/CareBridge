const express = require('express');
const router = express.Router();
const { chatWithCopilot } = require('../controllers/ai.controller');
const { protect } = require('../middlewares/auth.middleware');
const Alert = require('../models/Alert');

// @desc    Chat with AI Copilot
// @route   POST /api/ai/chat
router.post('/chat', protect, chatWithCopilot);

// @desc    Get user alerts
// @route   GET /api/alerts
router.get('/alerts', protect, async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
