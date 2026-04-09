const Career = require('../models/Career');
const { sendWhatsAppMessage, formatCareerMessage } = require('../utils/whatsapp');

const submitCareerApplication = async (req, res) => {
    try {
        const application = new Career(req.body);
        await application.save();
        console.log('✅ Career application saved, ID:', application._id);

        // Send WhatsApp notification
        const formattedMessage = formatCareerMessage(application);
        sendWhatsAppMessage(formattedMessage).catch(err => {
            console.error('⚠️ WhatsApp notification failed:', err.message);
        });

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
        console.error('❌ Career form error:', error);
        
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

const getCareerApplications = async (req, res) => {
    try {
        const applications = await Career.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
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