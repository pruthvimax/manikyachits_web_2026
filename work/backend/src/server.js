require('dotenv').config();
const connectDB = require('./config/database');
const app = require('./app');

// Connect to database with error handling
connectDB().catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Test your form: http://localhost:${PORT}/api/forms/chit-plan`);
    console.log(`📊 View submissions: http://localhost:${PORT}/api/forms/chit-plan/submissions`);
    console.log(`💬 Feedback endpoint: http://localhost:${PORT}/api/forms/feedback`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});