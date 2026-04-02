const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');

const app = express();

// Middleware
// app.use(cors());
// const cors = require("cors");
const allowedOrigins = [
  "https://blood-doner-web.vercel.app",
  "https://blood-doner-5db1ekjcm-rentroo.vercel.app"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow server-to-server requests
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `CORS policy: ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
}));

// Handle preflight OPTIONS requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
}));
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
