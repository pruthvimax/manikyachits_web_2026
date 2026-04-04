const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const submitContactForm = async (req, res) => {
  try {

    const contact = new Contact(req.body);
    await contact.save();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New Contact Form Submission - Manikya Chits",
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${contact.fullName}</p>
        <p><strong>Phone:</strong> ${contact.phoneNumber}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
        <p><strong>Newsletter:</strong> ${contact.newsletter ? "Yes" : "No"}</p>
        <p><strong>Submitted At:</strong> ${contact.createdAt}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you within 24 hours.',
      data: {
        id: contact._id,
        name: contact.fullName,
        email: contact.email,
        subject: contact.subject,
        submittedAt: contact.createdAt
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
