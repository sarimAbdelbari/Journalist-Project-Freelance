import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Avatar,
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText
  } from '@mui/material';
  import { MdClose } from 'react-icons/md';
  import { FaCalendarAlt, FaEnvelope, FaUser, FaTag, FaStar } from 'react-icons/fa';
  import '@/pages/admin/users/users.css';

  
  export default function ViewUserDialog({ open, onClose, user }) {
    if (!user) return null;
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString();
    };
    
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        className="user-dialog view-dialog"
      >
        <DialogTitle className="dialog-title">
          User Details
          <IconButton 
            onClick={onClose}
            className="close-button"
          >
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box className="user-details-container">
            <Box className="user-header">
              <Avatar 
                src={user.imagepic} 
                alt={user.username}
                sx={{ width: 100, height: 100 }}
                className="user-avatar-large"
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" component="div" className="user-name">
                {user.username}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 1 }}>
                <Chip 
                  label={user.role} 
                  color={
                    user.role === 'admin' 
                      ? 'error' 
                      : user.role === 'journaliste' 
                        ? 'success' 
                        : 'primary'
                  }
                  className="role-chip-large"
                />
                <Chip 
                  label={user.active ? 'Active' : 'Inactive'} 
                  color={user.active ? 'success' : 'default'}
                  variant="outlined"
                  className="status-chip-large"
                />
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box className="user-info-section">
              <Box className="info-row">
                <FaEnvelope className="info-icon" />
                <Typography className="info-label">Email:</Typography>
                <Typography className="info-value">{user.email}</Typography>
              </Box>
              
              <Box className="info-row">
                <FaCalendarAlt className="info-icon" />
                <Typography className="info-label">Created:</Typography>
                <Typography className="info-value">{formatDate(user.createdAt)}</Typography>
              </Box>
              
              <Box className="info-row">
                <FaCalendarAlt className="info-icon" />
                <Typography className="info-label">Last Updated:</Typography>
                <Typography className="info-value">{formatDate(user.updatedAt)}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box className="favorites-section">
              <Typography variant="h6" className="section-title">
                <FaStar className="section-icon" />
                Favorite Articles
              </Typography>
              
              {user.favorites && user.favorites.length > 0 ? (
                <List>
                  {user.favorites.map((articleId, index) => (
                    <ListItem key={index} className="favorite-item">
                      <FaTag className="favorite-icon" />
                      <ListItemText primary={`Article ID: ${articleId}`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography className="no-favorites">
                  No favorite articles yet.
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={onClose} className="close-view-button">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }