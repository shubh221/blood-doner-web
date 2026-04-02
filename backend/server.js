const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', donorRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Blood Donor API running' }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

// Keep-alive ping for Render free tier
const https = require('https');
setInterval(() => {
  https.get('https://blood-doner-web.onrender.com/');
}, 14 * 60 * 1000); // every 14 minutes

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
