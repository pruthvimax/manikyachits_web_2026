const Feedback = require('../models/Feedback');
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: "⭐ New Feedback Submitted - Manikya Chits",
            html: `
                <h2>New Feedback Received</h2>
                <p><strong>Name:</strong> ${feedback.name}</p>
                <p><strong>Email:</strong> ${feedback.email}</p>
                <p><strong>Category:</strong> ${feedback.category}</p>
                <p><strong>Rating:</strong> ${feedback.rating} / 5</p>
                <p><strong>Message:</strong></p>
                <p>${feedback.message}</p>
                <p><strong>Submitted At:</strong> ${feedback.createdAt}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: feedback
        });

    } catch (error) {

        console.error('Feedback submission error:', error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });

    }
};


// Get all feedback
exports.getFeedback = async (req, res) => {
    try {

        let filter = {};

        if (req.query.rating) {
            const rating = parseInt(req.query.rating);
            if (rating === 5) {
                filter.rating = 5;
            } else if (rating === 4) {
                filter.rating = { $gte: 4 };
            }
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        let sort = { createdAt: -1 };
        if (req.query.sort === 'popular') {
            sort = { helpfulCount: -1 };
        }

        const feedbacks = await Feedback.find(filter).sort(sort).limit(20);

        const total = await Feedback.countDocuments();

        const averageRating = await Feedback.aggregate([
            { $group: { _id: null, avg: { $avg: "$rating" } } }
        ]);

        const positiveCount = await Feedback.countDocuments({ rating: { $gte: 4 } });

        const positivePercent = total > 0
            ? (positiveCount / total * 100).toFixed(0)
            : 0;

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

        res.status(500).json({
            success: false,
            message: 'Server error'
        });

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
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.json({
            success: true,
            data: feedback
        });

    } catch (error) {

        console.error('Mark helpful error:', error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });

    }
};