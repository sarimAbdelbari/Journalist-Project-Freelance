import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Box,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  FaTimes, 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt,
  FaStar,
  FaIdCard,
  FaList
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getArticlesByIds } from '@/services/userService';
import '@/pages/admin/users/users.css';

export default function ViewUserDialog({ open, onClose, user, getImageUrl }) {
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

useEffect(() => {
  const fetchFavoriteArticles = async () => {
    if (!user || !user.favorites) return;
    
    // First, ensure favorites is treated as an array and contains valid data
    const favoritesArray = Array.isArray(user.favorites) 
      ? user.favorites.filter(id => id && typeof id === 'string' && id.trim() !== '')
      : typeof user.favorites === 'string' && user.favorites.trim() !== ''
        ? [user.favorites] 
        : [];
    
    console.log('Raw favorites data:', user.favorites);
    console.log('Processed favorites array:', favoritesArray);
    
    if (favoritesArray.length === 0) {
      console.log('No valid favorites IDs found for user');
      setFavoriteArticles([]);
      return;
    }
    
    setLoadingFavorites(true);
    setFavoriteArticles([]); // Reset on each load
    
    try {
      console.log("Fetching favorites for user:", user.username);
      console.log("Favorites array:", favoritesArray);
      
      const response = await getArticlesByIds(favoritesArray);
      
      console.log("API Response:", response);
      
      if (response && response.success && Array.isArray(response.data)) {
        setFavoriteArticles(response.data);
        console.log('Successfully loaded favorite articles:', response.data);
      } else {
        console.error('Failed to fetch favorites:', response?.message || 'Unknown error');
        setFavoriteArticles([]);
      }
    } catch (error) {
      console.error('Error fetching favorite articles:', error);
      setFavoriteArticles([]);
    } finally {
      setLoadingFavorites(false);
    }
  };
  
  if (open && user) {
    fetchFavoriteArticles();
  }
}, [user, open]);

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="user-dialog"
    >
      <DialogTitle className="dialog-title">
        User Details
        <IconButton onClick={onClose} className="close-button">
          <FaTimes />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box className="user-details-container">
          <Box className="user-header">
            <Avatar 
              src={user.imagepic ? getImageUrl(user.imagepic) : null}
              alt={user.username}
              sx={{ width: 120, height: 120, fontSize: '3rem' }}
              className="user-avatar-large"
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            
            <Typography variant="h5" className="user-name">
              {user.username}
            </Typography>
            
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Chip 
                label={user.role} 
                color={
                  user.role === 'admin' ? 'error' : 
                  user.role === 'journaliste' ? 'success' : 
                  'primary'
                } 
                variant="outlined"
                className="role-chip-large"
              />
              
              <Chip 
                label={user.active ? 'Active' : 'Inactive'} 
                color={user.active ? 'success' : 'default'} 
                className="status-chip-large"
              />
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box className="user-info-section">
            <Typography variant="h6" sx={{ mb: 2 }}>Basic Information</Typography>
            
            <Box className="info-row">
              <FaIdCard className="info-icon" />
              <Typography className="info-label">User ID:</Typography>
              <Typography className="info-value">{user.id}</Typography>
            </Box>
            
            <Box className="info-row">
              <FaEnvelope className="info-icon" />
              <Typography className="info-label">Email:</Typography>
              <Typography className="info-value">{user.email}</Typography>
            </Box>
            
            <Box className="info-row">
              <FaUser className="info-icon" />
              <Typography className="info-label">Bio:</Typography>
              <Typography className="info-value">
                {user.bio || "No biography provided"}
              </Typography>
            </Box>
            
            <Box className="info-row">
              <FaCalendarAlt className="info-icon" />
              <Typography className="info-label">Created:</Typography>
              <Typography className="info-value">{formatDate(user.createdAt)}</Typography>
            </Box>
            
            <Box className="info-row">
              <FaCalendarAlt className="info-icon" />
              <Typography className="info-label">Updated:</Typography>
              <Typography className="info-value">{formatDate(user.updatedAt)}</Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box className="favorites-section">
            <Typography variant="h6" className="section-title">
              <FaStar className="section-icon" />
              Favorite Articles ({Array.isArray(user.favorites) ? user.favorites.length : 0})
            </Typography>
            
            {loadingFavorites ? (
              <Box className="loading-favorites-container">
                <CircularProgress size={24} />
                <Typography className="loading-favorites">
                  Loading favorite articles...
                </Typography>
              </Box>
            ) : favoriteArticles && favoriteArticles.length > 0 ? (
              <Box className="favorites-list">
                {favoriteArticles.map((article) => (
                  <Box key={article._id} className="favorite-item">
                    <FaList className="favorite-icon" />
                    <Typography className="favorite-title">
                      {article.title}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography className="no-favorites">
                {Array.isArray(user.favorites) && user.favorites.length > 0 
                  ? "Failed to load article details" 
                  : "This user hasn't liked any articles yet."}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions className="dialog-actions">
        <Button 
          onClick={onClose} 
          variant="contained" 
          className="close-view-button"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}