const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    registerUser, 
    loginUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/userControllers');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/:id')
    .put(protect, updateUser)
    .delete(protect, authorize('admin'), deleteUser);

module.exports = router;