import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box
  } from '@mui/material';
  import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
  import '@/pages/admin/users/users.css';

  
  export default function DeleteUserDialog({ open, onClose, onConfirm, username }) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        className="user-dialog"
      >
        <DialogTitle className="dialog-title">
          Delete User
          <IconButton onClick={onClose} className="close-button">
            <FaTimes />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box className="delete-content">
            <FaExclamationTriangle className="warning-icon" />
            <Typography variant="h6" component="h3">
              Are you sure you want to delete this user?
            </Typography>
            <Typography>
              You are about to delete the user {username} . This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions className="dialog-actions">
          <Button 
            onClick={onClose} 
            className="cancel-button"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            variant="contained" 
            className="delete-confirm-button"
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    );
  }