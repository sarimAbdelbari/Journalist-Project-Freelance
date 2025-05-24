const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getCommentsByArticleId,
  likeComment,
  deleteComment,
  getAllComments // Add this import
} = require('../controllers/commentControllers');

// Comments-specific routes
router.get('/', protect, authorize('admin'), getAllComments);

router.get('/articles/:articleId/comments', getCommentsByArticleId);


router.post('/:id/like', protect, likeComment);
router.delete('/:id', protect, deleteComment);

// Admin route to get all comments

module.exports = router;