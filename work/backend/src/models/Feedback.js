const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['general', 'service', 'app', 'payment', 'chit', 'suggestion', 'complaint']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    message: {
        type: String,
        required: [true, 'Feedback message is required'],
        trim: true,
        maxlength: 1000
    },
    helpfulCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add debug pre-save middleware
feedbackSchema.pre('save', function(next) {
    console.log('📝 Attempting to save feedback:', {
        name: this.name,
        email: this.email,
        rating: this.rating,
        category: this.category
    });
    next();
});

// Add post-save middleware
feedbackSchema.post('save', function(doc) {
    console.log('✅ Feedback saved successfully! ID:', doc._id);
});

module.exports = mongoose.model('Feedback', feedbackSchema);