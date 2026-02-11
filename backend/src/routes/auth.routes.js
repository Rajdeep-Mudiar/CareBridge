const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Must be true for sameSite: 'none'
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await require('../models/User').findById(decoded.id).select('-googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid' });
  }
});

module.exports = router;
