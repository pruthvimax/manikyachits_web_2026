const Feedback = require('../models/Feedback');
const { sendWhatsAppMessage, formatFeedbackMessage } = require('../utils/whatsapp');

const submitFeedback = async (req, res) => {
    try {
        console.log('📝 Received feedback submission:', req.body);
        
        const feedback = new Feedback(req.body);
        await feedback.save();
        console.log('✅ Feedback saved to database, ID:', feedback._id);

        // Send WhatsApp notification
        const formattedMessage = formatFeedbackMessage(feedback);
        sendWhatsAppMessage(formattedMessage).catch(err => {
            console.error('⚠️ WhatsApp notification failed:', err.message);
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

module.exports = {
    submitFeedback,
    getFeedback,
    markHelpful
};