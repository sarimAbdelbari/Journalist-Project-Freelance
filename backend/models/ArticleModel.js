const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxLength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content'],
    },
    category: {
        type: [String],
        enum: ['business', 'politics', 'entertainment', 'health', 'science', 'sports', 'technology','other'],
        default: ['other'],
        validate: {
            validator: function(array) {
                return array.every(value => ['business', 'politics', 'entertainment', 'health', 'science', 'sports', 'technology','other'].includes(value));
            },
            message: 'Each category must be from the allowed list'
        }
    },
    tags: [String],
    mediaType: {
        type: String,
        enum: ['image', 'video', 'none'],
        default: 'none'
    },
    mediaUrl: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    status: {
        type: String,
        enum: ['pending', 'approved','denied'],
        default: 'pending'
    },
    readTime:{
        type: String,
        default: Math.floor(Math.random() * 10) + ' min read'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);