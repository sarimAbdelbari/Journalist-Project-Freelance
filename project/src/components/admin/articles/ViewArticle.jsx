import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  CardMedia,
  Divider,
  Paper
} from '@mui/material';
import {
  FaTimes,
  FaHeart,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaTag,
  FaBookmark
} from 'react-icons/fa';
import parse from 'html-react-parser';

const ViewArticle = ({ open, onClose, article, onStatusChange, getImageUrl }) => {
  if (!article) return null;
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short', // Changed to short month format
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.log("error", error);
      return 'Invalid date';
    }
  };

  // Helper for status style
  const getStatusStyles = (status) => {
    switch(status) {
      case 'approved': 
        return {
          icon: <FaCheckCircle />,
          color: 'success',
          label: 'Approved'
        };
      case 'denied': 
        return {
          icon: <FaTimesCircle />,
          color: 'error',
          label: 'Denied'
        };
      default: 
        return {
          icon: <FaExclamationTriangle />,
          color: 'warning',
          label: 'Pending'
        };
    }
  };

  const statusInfo = getStatusStyles(article.status);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      className="view-article-dialog"
      scroll="paper"
      PaperProps={{
        elevation: 24,
        sx: { borderRadius: '12px' }
      }}
    >
      {/* Header Banner with Status */}
      <Box 
        className="article-status-banner"
        sx={{
          backgroundColor: `var(--color-${statusInfo.color}-100)`,
          color: `var(--color-${statusInfo.color}-700)`,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid var(--color-${statusInfo.color}-200)`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {statusInfo.icon}
          <Typography variant="subtitle2">
            Status: <strong>{statusInfo.label}</strong>
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ color: `var(--color-${statusInfo.color}-700)` }}
        >
          <FaTimes />
        </IconButton>
      </Box>
      
      <DialogContent className="dialog-content article-viewer">
        {/* Article Header */}
        <Box className="article-main-header" sx={{ mb: 3 }}>
          {/* Title */}
          <Typography 
            variant="h4" 
            component="h1" 
            className="article-title"
            sx={{ 
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.2,
              color: 'var(--color-neutral-900)'
            }}
          >
            {article.title}
          </Typography>
          
          {/* Author and Published Date Row */}
          <Box 
            className="article-meta-primary"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2
            }}
          >
            <Box 
              className="article-author"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Avatar 
                src={article.author?.imagepic ? getImageUrl(article.author.imagepic) : null}
                alt={article.author?.username || 'Unknown'}
                sx={{ 
                  width: 38, 
                  height: 38,
                  border: '2px solid var(--color-primary-100)'
                }}
              >
                {article.author?.username?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ fontWeight: 600, lineHeight: 1.2 }}
                >
                  {article.author?.username || 'Unknown Author'}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <FaCalendarAlt style={{ fontSize: '0.75rem' }} />
                  {formatDate(article.createdAt)}
                </Typography>
              </Box>
            </Box>
            
            <Divider orientation="vertical" flexItem />
            
            {/* Stats */}
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Chip
                icon={<FaHeart style={{ fontSize: '0.75rem' }} />}
                label={`${article.likes?.length || 0} likes`}
                size="small"
                variant="outlined"
                sx={{ 
                  borderColor: 'var(--color-error-200)',
                  color: 'var(--color-error-700)',
                  backgroundColor: 'var(--color-error-50)',
                  '& .MuiChip-icon': { color: 'var(--color-error-500)' }
                }}
              />
              
              <Chip
                icon={<FaClock style={{ fontSize: '0.75rem' }} />}
                label={article.readTime || 'N/A'}
                size="small"
                variant="outlined"
                sx={{ 
                  borderColor: 'var(--color-primary-200)',
                  color: 'var(--color-primary-700)',
                  backgroundColor: 'var(--color-primary-50)',
                  '& .MuiChip-icon': { color: 'var(--color-primary-500)' }
                }}
              />
            </Box>
          </Box>
          
          {/* Categories & Tags */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="overline" 
              sx={{ 
                display: 'block',
                mb: 1,
                color: 'var(--color-neutral-600)',
                letterSpacing: 1
              }}
            >
              Categories & Tags
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Array.isArray(article.category) && article.category.map((cat, index) => (
                <Chip 
                  key={index}
                  label={cat}
                  size="small"
                  sx={{
                    backgroundColor: 'var(--color-primary-100)',
                    color: 'var(--color-primary-800)',
                    fontWeight: 500
                  }}
                />
              ))}
              
              {Array.isArray(article.tags) && article.tags.map((tag, index) => (
                <Chip 
                  key={index}
                  icon={<FaTag style={{ fontSize: '0.75rem' }} />}
                  label={tag}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: 'var(--color-neutral-300)',
                    color: 'var(--color-neutral-700)'
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
        
        {/* Featured Image */}
        {article.mediaUrl && article.mediaType === 'image' && (
          <Paper 
            elevation={1}
            sx={{
              mb: 4,
              overflow: 'hidden',
              borderRadius: '12px'
            }}
          >
            <CardMedia
              component="img"
              image={getImageUrl(article.mediaUrl)}
              alt={article.title}
              sx={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Error';
                e.target.onerror = null;
              }}
            />
          </Paper>
        )}
        
        {/* Article Content */}
        <Paper 
          elevation={0} 
          sx={{
            padding: 3,
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid var(--color-neutral-200)'
          }}
          className="content-container"
        >
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              color: 'var(--color-neutral-800)',
              fontWeight: 600
            }}
          >
            <FaBookmark style={{ color: 'var(--color-primary-500)', fontSize: '0.85rem' }} />
            Article Content
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box className="article-content rich-text-content">
            {article.content ? (
              typeof article.content === 'string' ? 
                parse(article.content) :
                <Typography>{JSON.stringify(article.content)}</Typography>
            ) : (
              <Typography variant="body1" className="no-content">
                No content available
              </Typography>
            )}
          </Box>
        </Paper>
      </DialogContent>
      
      <DialogActions 
        sx={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-neutral-200)',
          backgroundColor: 'var(--color-neutral-50)'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {article.status !== 'approved' && (
              <Button
                variant="contained"
                color="success"
                onClick={() => onStatusChange('approved')}
                startIcon={<FaCheckCircle />}
                sx={{ 
                  boxShadow: 2,
                  textTransform: 'none',
                  '&:hover': { boxShadow: 4 }
                }}
              >
                Approve
              </Button>
            )}
            {article.status !== 'denied' && (
              <Button
                variant="contained"
                color="error"
                onClick={() => onStatusChange('denied')}
                startIcon={<FaTimesCircle />}
                sx={{ 
                  boxShadow: 2,
                  textTransform: 'none',
                  '&:hover': { boxShadow: 4 }
                }}
              >
                Deny
              </Button>
            )}
            {article.status !== 'pending' && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => onStatusChange('pending')}
                startIcon={<FaExclamationTriangle />}
                sx={{ 
                  boxShadow: 2,
                  textTransform: 'none',
                  '&:hover': { boxShadow: 4 }
                }}
              >
                Mark Pending
              </Button>
            )}
          </Box>
          
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ 
              borderColor: 'var(--color-neutral-300)',
              color: 'var(--color-neutral-700)',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'var(--color-neutral-100)',
                borderColor: 'var(--color-neutral-400)'
              }
            }}
          >
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewArticle;