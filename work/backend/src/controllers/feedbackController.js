const Feedback = require('../models/Feedback');

// Submit new feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { name, email, category, rating, message } = req.body;
        
        const feedback = new Feedback({
            name,
            email,
            category,
            rating,
            message
        });
        
        await feedback.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Feedback submitted successfully',
            data: feedback
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all feedback (with optional filters)
exports.getFeedback = async (req, res) => {
    try {
        let filter = {};
        
        // Filter by rating
        if (req.query.rating) {
            const rating = parseInt(req.query.rating);
            if (rating === 5) {
                filter.rating = 5;
            } else if (rating === 4) {
                filter.rating = { $gte: 4 };
            }
        }
        
        // Filter by category
        if (req.query.category) {
            filter.category = req.query.category;
        }
        
        // Sort by most recent or helpful
        let sort = { createdAt: -1 };
        if (req.query.sort === 'popular') {
            sort = { helpfulCount: -1 };
        }
        
        const feedbacks = await Feedback.find(filter).sort(sort).limit(20);
        
        // Calculate stats
        const total = await Feedback.countDocuments();
        const averageRating = await Feedback.aggregate([
            { $group: { _id: null, avg: { $avg: "$rating" } } }
        ]);
        const positiveCount = await Feedback.countDocuments({ rating: { $gte: 4 } });
        const positivePercent = total > 0 ? (positiveCount / total * 100).toFixed(0) : 0;
        
        res.json({
            success: true,
            data: feedbacks,
            stats: {
                total,
                averageRating: averageRating[0]?.avg || 0,
                positivePercent
            }
        });
    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Mark feedback as helpful
exports.markHelpful = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { $inc: { helpfulCount: 1 } },
            { new: true }
        );
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
        res.json({ success: true, data: feedback });
    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};