const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createArticle,
    getArticles,
    getArticleById,
    getArticlesByUser,
    getArticlesByCategory,
    updateArticle,
    deleteArticle
} = require('../controllers/articleControllers');
const { uploadMedia } = require('../middleware/uploadMiddleware');
// Public routes
router.get('/',protect, getArticles);
router.get('/:id', protect, getArticleById);
router.get('/user/:userId', protect, getArticlesByUser);

router.get('/category/:category', protect, getArticlesByCategory);
// router.get('/category/:category', protect, getArticlesByCategory);

// Protected routes with file upload
// router.post('/', upload.single('media'), createArticle);
// router.put('/:id', upload.single('media'), updateArticle);
// router.delete('/:id', deleteArticle);
router.post('/', protect,uploadMedia, createArticle);
router.put('/:id', protect,uploadMedia, updateArticle);
router.delete('/:id', protect, deleteArticle);


module.exports = router;