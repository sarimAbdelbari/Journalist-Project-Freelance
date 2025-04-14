const Article = require('../models/ArticleModel');

// Create a new article
const createArticle = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;
        const author = req.user.id;

        let mediaType = 'none';
        let mediaUrl = null;

        if (req.file) {
            mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
            mediaUrl = req.file.path;
        }

        const article = await Article.create({
            title,
            content,
            category,
            tags,
            author,
            mediaType,
            mediaUrl
        });

        res.status(201).json({
            success: true,
            message: 'Article created successfully',
            data: article
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to create article',
            error: error.message
        });
    }
};

// Update article
const updateArticle = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        if (article.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this article'
            });
        }

        let mediaType = article.mediaType;
        let mediaUrl = article.mediaUrl;

        if (req.file) {
            mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
            mediaUrl = req.file.path;
        }

        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                category,
                tags,
                mediaType,
                mediaUrl
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Article updated successfully',
            data: updatedArticle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update article',
            error: error.message
        });
    }
};

// Get all articles
const getArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch articles',
            error: error.message
        });
    }
};

// Get single article
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'name email');

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch article',
            error: error.message
        });
    }
};

const getArticlesByCategory = async (req, res) => {
  try {
    
  } catch (error) {
    console.error(error)
  }
}


// Delete article
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Check if user is the author
        if (article.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this article'
            });
        }

        await article.remove();

        res.status(200).json({
            success: true,
            message: 'Article deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete article',
            error: error.message
        });
    }
};

module.exports = {
    createArticle,
    getArticles,
    getArticleById,
    updateArticle,
    deleteArticle
};