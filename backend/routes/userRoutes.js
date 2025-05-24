const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    getAllUsers,
    getUserById,
    getJournalists,
    updateUser, 
    deleteUser,
    updateProfile
} = require('../controllers/userControllers');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

// General routes
router.get('/', getAllUsers);
router.get('/journalists', getJournalists);

router.put('/profile', protect, uploadAvatar, updateProfile);

// Parameterized routes should come after specific routes
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;