const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createArticle,
    getArticles,
    getFavArticles,
    getArticleById,
    getArticlesByUser,
    getArticlesByCategory,
    likeArticle,
    addComment,
    updateArticle,
    deleteArticle
} = require('../controllers/articleControllers');
const { uploadMedia } = require('../middleware/uploadMiddleware');
// Public routes
router.get('/', getArticles);
router.get('/favorites',protect, getFavArticles);
router.get('/my-articles',protect, getArticlesByUser);

router.get('/user/:userId', protect, getArticlesByUser);
router.get('/category/:category', protect, getArticlesByCategory);
router.get('/:id', getArticleById);
router.post('/:id/like', protect, likeArticle);
router.post('/:id/comments', protect, addComment);

// Protected routes with file upload
// router.post('/', upload.single('media'), createArticle);
// router.put('/:id', upload.single('media'), updateArticle);
// router.delete('/:id', deleteArticle);
router.post('/', protect,uploadMedia, createArticle);
router.put('/:id', protect,uploadMedia, updateArticle);
router.delete('/:id', protect, deleteArticle);


module.exports = router;