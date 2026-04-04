const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const formRoutes = require('./routes/formRoutes');

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://manikyachits.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }

  }
}));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Logging
app.use(morgan('dev'));

// Parse JSON
app.use(express.json());

// Routes
app.use('/api/forms', formRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: "Manikya Chits API is running",
    endpoints: {
      health: "/api/health",
      forms: "/api/forms"
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;