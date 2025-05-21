const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCommentsByArticleId,
  likeComment,
  deleteComment
} = require('../controllers/commentControllers');

// Comments-specific routes
router.get('/articles/:articleId/comments', getCommentsByArticleId);
router.post('/:id/like', protect, likeComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;