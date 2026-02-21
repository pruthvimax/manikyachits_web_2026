const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const formRoutes = require('./routes/formRoutes');

const app = express();

// Update CORS to allow your frontend port
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], // Add your frontend port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Or for testing, you can allow all origins (easier during development):
// app.use(cors({ origin: '*' }));

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/forms', formRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Manikya API is running'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

module.exports = app;