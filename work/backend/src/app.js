const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const formRoutes = require('./routes/formRoutes');

const app = express();

// Security headers
app.use(helmet());


// Allowed origins - ADD YOUR NEW DOMAIN
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://manikyachits.vercel.app",
  "https://manikyachits.vercel.app/",
  "https://www.manikya-chaitsprivatelimited.com",  // ← ADD THIS
  "https://manikya-chaitsprivatelimited.com",       // ← ADD THIS (without www)
  "https://manikya-chaits-web-2026-94sjiz7oo-pruthvimaxs-projects.vercel.app", // ← Your Vercel preview URL
   "https://manikya-chaitsprivatelimited.com"     
];
// CORS configuration - FIXED VERSION
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked origin:', origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Logging
app.use(morgan('dev'));

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "Manikya API is running",
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  
  // Handle CORS errors specifically
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: 'CORS error: Origin not allowed'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;