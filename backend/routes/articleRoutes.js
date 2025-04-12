const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    createArticle,
    getArticles,
    getArticleById,
    updateArticle,
    deleteArticle
} = require('../controllers/articleControllers');

// Public routes
router.get('/', getArticles);
router.get('/:id', getArticleById);

// Protected routes with file upload
router.post('/', protect, upload.single('media'), createArticle);
router.put('/:id', protect, upload.single('media'), updateArticle);
router.delete('/:id', protect, deleteArticle);
// router.post('/', protect, upload.single('media'), createArticle);
// router.put('/:id', protect, upload.single('media'), updateArticle);
// router.delete('/:id', protect, deleteArticle);

module.exports = router;