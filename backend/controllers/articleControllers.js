const Article = require('../models/ArticleModel');
const Comment = require('../models/CommentsModel');

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
        const articles = await Article.find({ status: 'approved' })
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
        const article = await Article.findOne({ 
            _id: req.params.id,
            status: 'approved'
        })
            .populate('author', 'name email')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .populate('likes', 'name email');

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
        const { category } = req.params;
        const validCategories = ['business', 'entertainment', 'health', 'science', 'sports', 'technology', 'other'];

        if (!validCategories.includes(category.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        const articles = await Article.find({ 
            category: { $in: [category.toLowerCase()] },
            status: 'approved'
        })
            .populate('author', 'name email')
            .populate('comments')
            .populate('likes', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch articles by category',
            error: error.message
        });
    }
};

// Add like to article
const likeArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Check if already liked
        if (article.likes.includes(req.user.id)) {
            // Remove like
            article.likes = article.likes.filter(
                like => like.toString() !== req.user.id
            );
        } else {
            // Add like
            article.likes.push(req.user.id);
        }

        await article.save();

        res.status(200).json({
            success: true,
            message: 'Article like status updated',
            likes: article.likes.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update like status',
            error: error.message
        });
    }
};

// Add comment to article
const addComment = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        const { content } = req.body;

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        const comment = await Comment.create({
            content,
            article: req.params.id,
            user: req.user.id
        });

        article.comments.push(comment._id);
        await article.save();

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add comment',
            error: error.message
        });
    }
};

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
    getArticlesByCategory,
    updateArticle,
    deleteArticle,
    likeArticle,
    addComment
};