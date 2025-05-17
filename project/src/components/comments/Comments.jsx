import { useState, useEffect } from 'react';
import { addComment as addArticleComment } from '../../services/articleService';
import { getCommentsByArticleId, likeComment, deleteComment } from '../../services/articleCommentService';
import { useStateContext } from '../../contexts/ContextProvider';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { info_toast, error_toast, sucess_toast } from '@/utils/toastNotification';
import PropTypes from 'prop-types';
import './Comments.css';

const Comments = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userInfo } = useStateContext();

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await getCommentsByArticleId(articleId);
        if (response && response.data) {
          setComments(response.data);
        } else if (Array.isArray(response)) {
          setComments(response);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        error_toast("Failed to load comments.");
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) {
      fetchComments();
    }
  }, [articleId]);

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
        const addedCommentWithUserDetails = {
          ...response.data,
          user: {
            id: userInfo.id,
            username: userInfo.username,
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
        setComments(prevComments =>
          prevComments.map(comment =>
            comment._id === commentId ? { ...comment, likes: response.data.likes } : comment
          )
        );
        sucess_toast(response.message);
      } else {
        error_toast(response.message || "Failed to like comment");
      }
    } catch (error) {
      error_toast("Failed to like comment");
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!userInfo || !userInfo.id) return;

    try {
      const response = await deleteComment(commentId);
      if (response && response.success) {
        setComments(prevComments =>
          prevComments.filter(comment => comment._id !== commentId)
        );
        sucess_toast(response.message);
      } else {
        error_toast(response.message || "Failed to delete comment");
      }
    } catch (error) {
      error_toast("Failed to delete comment");
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="comments-section">
      <h4>Comments ({comments.length})</h4>
      {userInfo && (
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            rows={3}
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      )}
      {!userInfo && <p>Please <a href="/login">login</a> to comment.</p>}

      {isLoading ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map(comment => (
            <li key={comment._id} className="comment-item">
              <div className="comment-author">
                <img
                  src={comment.user?.imagepic || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.username || 'User')}&background=random`}
                  alt={comment.user?.username || 'User'}
                  className="comment-author-image"
                />
                <strong>{comment.user?.username || 'Anonymous User'}</strong>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
              <div className="comment-actions">
                <button onClick={() => handleLikeComment(comment._id)} className="comment-like-btn">
                  {comment.likes && userInfo && comment.likes.includes(userInfo.id) ? <FaHeart /> : <FaRegHeart />}
                  {comment.likes ? comment.likes.length : 0}
                </button>
                {userInfo && (userInfo.id === comment.user?._id || userInfo.role === 'admin') && (
                  <button onClick={() => handleDeleteComment(comment._id)} className="comment-delete-btn">
                    <FaTrash />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

// Add PropTypes validation
Comments.propTypes = {
  articleId: PropTypes.string.isRequired,
};

export default Comments;