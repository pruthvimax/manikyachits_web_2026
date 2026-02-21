require('dotenv').config();
const connectDB = require('./config/database');
const app = require('./app');

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Test your form: http://localhost:${PORT}/api/forms/chit-plan`);
  console.log(`📊 View submissions: http://localhost:${PORT}/api/forms/chit-plan/submissions`);
});