const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const formRoutes = require('./routes/formRoutes');

const app = express();

// Security headers
app.use(helmet());

// Allowed origins
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://manikyachits.vercel.app"
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
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

// Root route
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