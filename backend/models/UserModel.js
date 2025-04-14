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
    role :{
        enum: ['abonné', 'journaliste', 'admin'],
        default: 'abonné',
        type: String,
    },
    favorites: {
        type: [String],
        default: [],
    },
    active: {
        type: Boolean,
        default: true,
    },
    
}, { timestamps: true });

module.exports =  mongoose.model('User', userSchema);    