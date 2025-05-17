const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    getAllUsers,
    getUserById,
    getJournalists,
    updateUser, 
    deleteUser 
} = require('../controllers/userControllers');



router.get('/', getAllUsers);
router.get('/journalists',getJournalists);
router.get('/:id',protect, authorize('admin'), getUserById);

// Protected routes
// router.route('/:id')
//     .put( updateUser)
//     .delete(deleteUser);
router.route('/:id')
    .put(protect, updateUser)
    .delete(protect, authorize('admin'), deleteUser);

module.exports = router;