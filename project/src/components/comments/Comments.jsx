import { useState, useEffect } from 'react';
import { addComment as addArticleComment } from '../../services/articleService';
import {  likeComment, deleteComment } from '../../services/articleCommentService';
import { useStateContext } from '../../contexts/ContextProvider';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { info_toast, error_toast, sucess_toast } from '@/utils/toastNotification';
import PropTypes from 'prop-types';
import './Comments.css';

const Comments = ({ articleId, comments: initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userInfo } = useStateContext();

  useEffect(() => {
    // Update comments when initialComments prop changes
    if (initialComments && initialComments.length > 0) {
      setComments(initialComments);
    }
  }, [initialComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!userInfo || !userInfo.id) {
      info_toast("Please login to add a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addArticleComment(articleId, { content: newComment });
      if (response.success) {
        // Add the new comment to the list with user details
        const addedCommentWithUserDetails = {
          ...response.data,
          user: {
            _id: userInfo.id,
            username: userInfo.username,
            email: userInfo.email,
            imagepic: userInfo.imagepic
          }
        };
        setComments(prevComments => [addedCommentWithUserDetails, ...prevComments]);
        setNewComment('');
        sucess_toast("Comment added successfully!");
      } else {
        error_toast(response.message || "Failed to add comment");
      }
    } catch (error) {
      error_toast("Failed to add comment");
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!userInfo || !userInfo.id) {
      info_toast("Please login to like comments");
      return;
    }

    try {
      const response = await likeComment(commentId);
      if (response && response.success) {
        // Update the comments state with the updated likes
        setComments(prevComments =>
          prevComments.map(comment =>
            comment._id === commentId ? { ...comment, likes: response.data.likes } : comment
          )
        );
        sucess_toast(response.message || "Comment liked successfully");
      } else {
        error_toast(response.message || "Failed to like comment");
      }
    } catch (error) {
      error_toast("Failed to like comment");
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!userInfo || !userInfo.id) {
      info_toast("Please login to delete comments");
      return;
    }

    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await deleteComment(commentId);
        if (response && response.success) {
          // Remove the deleted comment from state
          setComments(prevComments =>
            prevComments.filter(comment => comment._id !== commentId)
          );
          sucess_toast("Comment deleted successfully");
        } else {
          error_toast(response.message || "Failed to delete comment");
        }
      } catch (error) {
        error_toast("Failed to delete comment");
        console.error('Error deleting comment:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get URL for image
  const getImageUrl = (path) => {
    if (!path) return null;
    // Remove /api from the end of the URL if it exists
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    
    // If path already starts with http or https, return it as is
    if (path.startsWith('http')) return path;
    
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  };

  return (
    <div className="comments-section">
      <h4 className="comments-title">Comments ({comments.length})</h4>
      {userInfo && (
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            className="comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className="comment-submit-btn"
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      )}
      {!userInfo && <p>Please <a href="/login">login</a> to comment.</p>}

      {isLoading ? (
        <p className="comments-loading">Loading comments...</p>
      ) : comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map(comment => (
            <li key={comment._id} className="comment-item">
              <div className="comment-avatar">
                <img
                  src={getImageUrl(comment.user?.imagepic) || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.username || 'User')}&background=random`}
                  alt={comment.user?.username || 'User'}
                />
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <h5 className="comment-author">{comment.user?.username || 'Anonymous User'}</h5>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="comment-text">{comment.content}</p>
                <div className="comment-actions">
                  <button onClick={() => handleLikeComment(comment._id)} className="comment-like-btn">
                    {comment.likes && userInfo && comment.likes.some(like => like === userInfo.id || like._id === userInfo.id) ? 
                      <FaHeart /> : <FaRegHeart />}
                    {comment.likes ? comment.likes.length : 0}
                  </button>
                  {userInfo && (userInfo.id === comment.user?._id || userInfo.role === 'admin') && (
                    <button onClick={() => handleDeleteComment(comment._id)} className="comment-delete-btn">
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="comments-empty">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

// Update PropTypes validation
Comments.propTypes = {
  articleId: PropTypes.string.isRequired,
  comments: PropTypes.array
};

export default Comments;