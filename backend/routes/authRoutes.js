const express = require('express');
const router = express.Router();
const { uploadAvatar } = require('../middleware/uploadMiddleware');
const { 
    registerUser, 
    loginUser, 
    checkAuth,
    Logout
} = require('../controllers/authControllers');

// Public routes
router.post('/checkAuth', checkAuth);
router.post('/register',uploadAvatar, registerUser);
router.post('/login', loginUser);
router.post('/logout', Logout);

module.exports = router;