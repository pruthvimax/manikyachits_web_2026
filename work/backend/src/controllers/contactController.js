const Contact = require('../models/Contact');

const submitContactForm = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    // Send WhatsApp notification
    await sendWhatsAppContactNotification(contact);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.fullName,
        mobile: contact.phoneNumber,
        email: contact.email
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
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

async function sendWhatsAppContactNotification(data) {
  const phoneNumber = "917899698083"; // REPLACE WITH YOUR NUMBER
  const apiKey = "YOUR_API_KEY";
  
  const message = `📞 *NEW CONTACT FORM* 📞
  
👤 *Name:* ${data.fullName}
📱 *Phone:* ${data.phoneNumber}
📧 *Email:* ${data.email}
📋 *Subject:* ${data.subject}
💬 *Message:* ${data.message}`;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
  
  try {
    await fetch(url);
    console.log('WhatsApp notification sent for contact form');
  } catch (error) {
    console.error('WhatsApp send failed:', error);
  }
}

const getContactSubmissions = async (req, res) => {
  try {
    const submissions = await Contact.find().sort({ createdAt: -1 });
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
  submitContactForm,
  getContactSubmissions
};