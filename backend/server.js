// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');

// Route imports
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');

const app = express();

// =======================
// CORS Setup
// =======================

// FRONTEND_URL can be a single URL or comma-separated list
// e.g., "https://blood-doner-web.vercel.app,https://blood-doner-branch.vercel.app"
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or curl requests
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error(`CORS policy: ${origin} not allowed`), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Handle preflight requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// =======================
// Middleware
// =======================
app.use(express.json());

// =======================
// Routes
// =======================
app.use('/api', authRoutes);
app.use('/api', donorRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Blood Donor API running' });
});

// =======================
// MongoDB Connection & Server Start
// =======================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // =======================
    // Keep-alive ping for Render free tier
    // =======================
    setInterval(() => {
      try {
        https.get('https://blood-doner-web.onrender.com/');
      } catch (err) {
        console.error('Keep-alive ping failed:', err.message);
      }
    }, 14 * 60 * 1000); // every 14 minutes
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
