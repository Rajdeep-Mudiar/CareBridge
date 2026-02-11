const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Trust proxy for secure cookies in production (Render/Vercel)
app.set('trust proxy', 1);

// Passport config
require('./config/passport')(passport);

// Middleware
app.use(cors({
  origin: (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''),
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Passport middleware
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', require('./routes/ai.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CareBridge Backend is running' });
});

module.exports = app;
