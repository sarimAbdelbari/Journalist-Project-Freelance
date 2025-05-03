
import { useState, useEffect } from 'react';
import { getCommentsByArticleId, addComment, likeComment, deleteComment } from '../../services/articleCommentService';
import { useStateContext } from '../../contexts/ContextProvider';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { info_toast, error_toast } from '@/utils/toastNotification';
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
        const data = await getCommentsByArticleId(articleId);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
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
    
    if (!userInfo) {
      info_toast("Please login to add a comment");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const userId = userInfo.id;
      const addedComment = await addComment(articleId, userId, newComment);
      setComments(prevComments => [addedComment, ...prevComments]);
      setNewComment('');
    } catch (error) {
      error_toast("Failed to add comment");
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!userInfo) {
      info_toast("Please login to like comments");
      return;
    }
    
    try {
      const updatedComment = await likeComment(commentId);
      if (updatedComment) {
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === updatedComment.id ? updatedComment : comment
          )
        );
      }
    } catch (error) {
      error_toast("Failed to like comment");
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!userInfo) return;
    
    try {
      const deletedComment = await deleteComment(commentId);
      if (deletedComment) {
        setComments(prevComments => 
          prevComments.filter(comment => comment.id !== deletedComment.id)
        );
      }
    } catch (error) {
      error_toast("Failed to delete comment");
      console.error('Error deleting comment:', error);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments ({comments.length})</h3>
      
      {/* Comment form */}
      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
          className="comment-input"
          disabled={isSubmitting || !userInfo}
        />
        <button 
          type="submit" 
          className="comment-submit-btn"
          disabled={isSubmitting || !userInfo}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
      
      {/* Comments list */}
      <div className="comments-list">
        {isLoading ? (
          <p className="comments-loading">Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">
                <img src={comment.user.avatar} alt={comment.user.name} />
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <h4 className="comment-author">{comment.user.name}</h4>
                  <span className="comment-date">{formatDate(comment.date)}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                <div className="comment-actions">
                  <button 
                    className="comment-like-btn"
                    onClick={() => handleLikeComment(comment.id)}
                    aria-label="Like comment"
                  >
                    {comment.liked ? <FaHeart /> : <FaRegHeart />} {comment.likes}
                  </button>
                
                  {userInfo && (userInfo.id === comment.user.id || userInfo.role === 'admin') && (
                    <button 
                      className="comment-delete-btn"
                      onClick={() => handleDeleteComment(comment.id)}
                      aria-label="Delete comment"
                    >
                      <FaTrash /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="comments-empty">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default Comments;