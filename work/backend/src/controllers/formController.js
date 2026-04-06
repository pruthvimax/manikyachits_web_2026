const ChitScheme = require('../models/ChitScheme');

// Submit chit plan with WhatsApp notification
const submitChitPlan = async (req, res) => {
  try {
    const chitPlan = new ChitScheme(req.body);
    await chitPlan.save();

    // Send WhatsApp notification
    await sendWhatsAppNotification(chitPlan);

    res.status(201).json({
      success: true,
      message: 'Thank you! Our advisor will contact you shortly.',
      data: {
        id: chitPlan._id,
        name: chitPlan.name,
        mobile: chitPlan.mobile,
        email: chitPlan.email,
        submittedAt: chitPlan.createdAt
      }
    });

  } catch (error) {
    console.error('Chit plan form error:', error);

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

// WhatsApp notification function
async function sendWhatsAppNotification(data) {
  // Using CallMeBot API (completely free)
  const phoneNumber = "91XXXXXXXXXX"; // REPLACE WITH YOUR PHONE NUMBER (without +, with country code)
  const apiKey = "YOUR_API_KEY"; // Get from https://www.callmebot.com/blog/free-whatsapp-api/
  
  const message = `🔔 *NEW CHIT PLAN INQUIRY* 🔔
  
📌 *Name:* ${data.name}
📞 *Mobile:* ${data.mobile}
📧 *Email:* ${data.email}
⏰ *Time:* ${data.createdAt}

📱 *Customer wants more information about chit plans.*`;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    console.log('WhatsApp notification sent:', response.status);
  } catch (error) {
    console.error('WhatsApp send failed:', error);
    // Don't throw error - form submission still succeeds
  }
}

const getChitPlanSubmissions = async (req, res) => {
  try {
    const submissions = await ChitScheme.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  submitChitPlan,
  getChitPlanSubmissions
};