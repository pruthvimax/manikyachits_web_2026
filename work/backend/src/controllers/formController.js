const ChitScheme = require('../models/ChitScheme');
const { sendWhatsAppMessage, formatChitPlanMessage } = require('../utils/whatsapp');

// Submit chit plan with WhatsApp notification
const submitChitPlan = async (req, res) => {
    try {
        const chitPlan = new ChitScheme(req.body);
        await chitPlan.save();
        console.log('✅ Chit plan saved to database, ID:', chitPlan._id);

        // Send WhatsApp notification (don't await - let it run in background)
        const formattedMessage = formatChitPlanMessage(chitPlan);
        sendWhatsAppMessage(formattedMessage).catch(err => {
            console.error('⚠️ WhatsApp notification failed but form submitted:', err.message);
        });

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
        console.error('❌ Chit plan form error:', error);
        
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

const getChitPlanSubmissions = async (req, res) => {
    try {
        const submissions = await ChitScheme.find().sort({ createdAt: -1 });
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
    submitChitPlan,
    getChitPlanSubmissions
};