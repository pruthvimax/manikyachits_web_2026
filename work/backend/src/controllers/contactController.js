const Contact = require('../models/Contact');
const { sendWhatsAppMessage, formatContactMessage } = require('../utils/whatsapp');

const submitContactForm = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        console.log('✅ Contact form saved to database, ID:', contact._id);

        // Send WhatsApp notification
        const formattedMessage = formatContactMessage(contact);
        sendWhatsAppMessage(formattedMessage).catch(err => {
            console.error('⚠️ WhatsApp notification failed:', err.message);
        });

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
        console.error('❌ Contact form error:', error);
        
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
        console.error('Error fetching submissions:', error);
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