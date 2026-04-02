// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');

const app = express();

// =======================
// CORS Setup
// =======================

// FRONTEND_URL can be comma-separated list of allowed frontends
// e.g., "https://blood-doner-web.vercel.app,https://blood-doner-branch.vercel.app"
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // server-to-server requests
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`Blocked CORS request from origin: ${origin}`);
    return callback(null, false); // respond with 200 but no headers
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

// Use CORS middleware for all requests
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

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

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Keep-alive ping for Render free tier
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
