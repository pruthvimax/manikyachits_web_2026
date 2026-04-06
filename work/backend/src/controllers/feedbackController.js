const Feedback = require('../models/Feedback');

// Submit feedback with WhatsApp notification
const submitFeedback = async (req, res) => {
  try {
    console.log('📝 Received feedback submission:', req.body);
    
    const feedback = new Feedback(req.body);
    await feedback.save();
    
    console.log('✅ Feedback saved to database, ID:', feedback._id);

    // Send WhatsApp notification (don't wait for it to complete)
    sendWhatsAppFeedbackNotification(feedback).catch(err => {
      console.error('⚠️ WhatsApp notification failed but form submitted:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      data: {
        id: feedback._id,
        name: feedback.name,
        rating: feedback.rating,
        category: feedback.category,
        message: feedback.message
      }
    });

  } catch (error) {
    console.error('❌ Feedback submission error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
};

// WhatsApp notification function for feedback
async function sendWhatsAppFeedbackNotification(data) {
  // Get credentials from environment variables
  const phoneNumber = process.env.WHATSAPP_PHONE || "919876543210"; // Replace with your number
  const apiKey = process.env.WHATSAPP_API_KEY || "YOUR_API_KEY"; // Get from CallMeBot
  
  // Create rating stars
  const stars = '⭐'.repeat(data.rating);
  const emptyStars = '☆'.repeat(5 - data.rating);
  
  // Format the message
  const message = `*📝 NEW FEEDBACK RECEIVED* 📝
  
*👤 Name:* ${data.name}
*📧 Email:* ${data.email}
*🏷️ Category:* ${data.category.toUpperCase()}
*⭐ Rating:* ${data.rating}/5 ${stars}${emptyStars}
*💬 Message:* 
${data.message}
*🕐 Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

  // CallMeBot API URL
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
  
  try {
    // Using fetch (Node.js 18+)
    const response = await fetch(url);
    const result = await response.text();
    console.log('📱 WhatsApp notification status:', response.status, result);
    return result;
  } catch (error) {
    console.error('❌ WhatsApp send failed:', error.message);
    throw error;
  }
}

// Get all feedback (for admin panel)
const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mark feedback as helpful
const markHelpful = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    feedback.helpfulCount = (feedback.helpfulCount || 0) + 1;
    await feedback.save();
    
    res.json({
      success: true,
      message: 'Marked as helpful',
      helpfulCount: feedback.helpfulCount
    });
  } catch (error) {
    console.error('Error marking helpful:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get feedback statistics
const getFeedbackStats = async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const avgRating = await Feedback.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" } } }
    ]);
    const byCategory = await Feedback.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      stats: {
        total,
        averageRating: avgRating[0]?.avg || 0,
        byCategory
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  submitFeedback,
  getFeedback,
  markHelpful,
  getFeedbackStats
};