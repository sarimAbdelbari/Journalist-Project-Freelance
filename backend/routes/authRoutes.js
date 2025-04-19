const express = require('express');
const router = express.Router();

const { 
    registerUser, 
    loginUser, 
    checkAuth,
    Logout
} = require('../controllers/authControllers');

// Public routes
router.post('/checkAuth', checkAuth);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', Logout);

module.exports = router;