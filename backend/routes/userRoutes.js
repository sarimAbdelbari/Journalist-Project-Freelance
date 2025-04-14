const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    registerUser, 
    loginUser, 
    getAllUsers,
    getUserById,
    updateUser, 
    deleteUser 
} = require('../controllers/userControllers');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
// Protected routes
// router.route('/:id')
//     .put( updateUser)
//     .delete(deleteUser);
router.route('/:id')
    .put(protect, updateUser)
    .delete(protect, authorize('admin'), deleteUser);

module.exports = router;