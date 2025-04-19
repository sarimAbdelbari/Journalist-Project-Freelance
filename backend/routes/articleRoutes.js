const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    createArticle,
    getArticles,
    getArticleById,
    getArticlesByCategory,
    updateArticle,
    deleteArticle
} = require('../controllers/articleControllers');

// Public routes
router.get('/',protect, getArticles);
router.get('/:id', protect, getArticleById);

router.get('/category/:category', protect, getArticlesByCategory);
// router.get('/category/:category', protect, getArticlesByCategory);

// Protected routes with file upload
// router.post('/', upload.single('media'), createArticle);
// router.put('/:id', upload.single('media'), updateArticle);
// router.delete('/:id', deleteArticle);
router.post('/', protect, upload.single('media'), createArticle);
router.put('/:id', protect, upload.single('media'), updateArticle);
router.delete('/:id', protect, deleteArticle);


module.exports = router;