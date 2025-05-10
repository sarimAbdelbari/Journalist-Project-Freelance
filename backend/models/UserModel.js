const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        enum: ['abonné', 'journaliste', 'admin'],
        default: 'abonné',
        type: String,
    },
    bio: {
        type: String,
        default: null,
    },
    socialLinks: {
        twitter: String,
        linkedin: String
    },
    expertiseAreas: {
        type: [String],
        default: []
    },
    favorites: {
        type: [String],
        default: [],
    },
    imagepic: {
        type: String,
        default: null,
    },
    active: {
        type: Boolean,
        default: true,
    },
    
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);