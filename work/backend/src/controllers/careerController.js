const Career = require('../models/Career');

const submitCareerApplication = async (req, res) => {
  try {
    const application = new Career(req.body);
    await application.save();

    await sendWhatsAppCareerNotification(application);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will contact you soon.',
      data: {
        id: application._id,
        name: `${application.firstName} ${application.lastName}`,
        jobRole: application.jobRole
      }
    });

  } catch (error) {
    console.error('Career form error:', error);
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

async function sendWhatsAppCareerNotification(data) {
  const phoneNumber = "9178996980832"; // REPLACE WITH YOUR NUMBER
  const apiKey = "YOUR_API_KEY";
  
  const message = `💼 *NEW JOB APPLICATION* 💼
  
👤 *Name:* ${data.firstName} ${data.lastName}
📱 *Phone:* ${data.phoneNumber}
📧 *Email:* ${data.email}
🎓 *Qualification:* ${data.qualification || 'Not specified'}
💼 *Position:* ${data.jobRole}
💬 *Message:* ${data.comments || 'No additional comments'}`;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
  
  try {
    await fetch(url);
    console.log('WhatsApp notification sent for job application');
  } catch (error) {
    console.error('WhatsApp send failed:', error);
  }
}

const getCareerApplications = async (req, res) => {
  try {
    const applications = await Career.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  submitCareerApplication,
  getCareerApplications
};