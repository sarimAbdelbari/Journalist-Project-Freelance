import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar, 
  Chip,
  IconButton,
  Link,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  FaTrash, 
  FaClock, 
  FaHeart, 
  FaExternalLinkAlt, 
  FaNewspaper,
  FaUser
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import CommentDelete from './CommentDelete';

const CommentCard = ({ comment, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Format relative time (e.g., "2 days ago")
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Get first part of image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };
  
  // Handle confirmation of delete
  const handleConfirmDelete = () => {
    onDelete();
    setDeleteDialogOpen(false);
  };

  return (
    <Card className="comment-card">
      <CardContent className="comment-content">
        <Box className="comment-header">
          <Box className="user-info">
            <Avatar 
              src={getImageUrl(comment.user?.imagepic)} 
              alt={comment.user?.username || 'User'}
              className="user-avatar"
            >
              {comment.user?.username?.charAt(0) || 'U'}
            </Avatar>
            <Box className="user-details">
              <Typography variant="subtitle1" className="username">
                {comment.user?.username || 'Anonymous User'}
              </Typography>
              <Box className="comment-meta">
                <Tooltip title={formatDate(comment.createdAt)}>
                  <Box className="meta-item">
                    <FaClock className="meta-icon" />
                    <Typography variant="caption">
                      {getRelativeTime(comment.createdAt)}
                    </Typography>
                  </Box>
                </Tooltip>
                <Box className="meta-item">
                  <FaHeart className="meta-icon" />
                  <Typography variant="caption">
                    {comment.likes?.length || 0} likes
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Tooltip title="Delete Comment">
            <IconButton 
              onClick={() => setDeleteDialogOpen(true)}
              color="error"
              size="small"
              className="delete-button"
            >
              <FaTrash />
            </IconButton>
          </Tooltip>
        </Box>
      
        <Box className="comment-body">
          <Typography variant="body1" className="comment-text">
            {comment.content}
          </Typography>
        </Box>
        
        <Divider className="comment-divider" />
        
        <Box className="article-info">
          <Box className="article-header">
            <FaNewspaper className="article-icon" />
            <Typography variant="subtitle2" className="article-label">
              Posted on article:
            </Typography>
          </Box>
          
          {comment.article ? (
            <Box className="article-details">
              <Typography variant="body2" className="article-title">
                {comment.article.title || 'Unknown Article'}
              </Typography>
              <Tooltip title="View Article">
                <Link 
                  component={RouterLink} 
                  to={`/article/${comment.article._id}`}
                  className="article-link"
                >
                  <FaExternalLinkAlt />
                </Link>
              </Tooltip>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Article not found or deleted
            </Typography>
          )}
          
          {comment.article?.author && (
            <Chip 
              icon={<FaUser />}
              label={`Author: ${typeof comment.article.author === 'object' ? 
                comment.article.author.username || 'Unknown' : 
                'Unknown'}`}
              size="small"
              className="author-chip"
            />
          )}
        </Box>
      </CardContent>
      
      <CommentDelete 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
};

export default CommentCard;