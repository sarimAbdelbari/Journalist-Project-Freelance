const mongoose = require('mongoose');
const Comment = require('../models/CommentsModel');
const Article = require('../models/ArticleModel');




const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'username email imagepic')
      .populate({
        path: 'article',
        select: 'title _id',
        populate: {
          path: 'author',
          select: 'username _id'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};

// Get all comments for an article
const getCommentsByArticleId = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate('user', 'username email imagepic')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};

// Like/unlike a comment
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user already liked this comment
    const likeIndex = comment.likes.findIndex(
      like => like.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // User already liked, so remove the like
      comment.likes.splice(likeIndex, 1);
    } else {
      // Add like
      comment.likes.push(req.user.id);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? 'Comment unliked' : 'Comment liked',
      data: {
        likes: comment.likes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update comment like',
      error: error.message
    });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // Remove comment from article
    await Article.findByIdAndUpdate(
      comment.article,
      { $pull: { comments: comment._id } }
    );

    // Delete comment
    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

module.exports = {
  getAllComments ,
  getCommentsByArticleId,
  likeComment,
  deleteComment
};