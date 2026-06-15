require('dotenv').config();
const connectDB = require('./config/database');
const app = require('./app');

// Connect to database
connectDB().catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Health check: /api/health`);
  console.log(`Forms API: /api/forms`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});