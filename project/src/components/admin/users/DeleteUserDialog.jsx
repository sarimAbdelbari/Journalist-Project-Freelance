import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton
  } from '@mui/material';
  import { MdClose } from 'react-icons/md';
  import { FaExclamationTriangle } from 'react-icons/fa';
  import '@/pages/admin/users/users.css';

  
  export default function DeleteUserDialog({ open, onClose, onConfirm, username }) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        className="user-dialog delete-dialog"
      >
        <DialogTitle className="dialog-title">
          Delete User
          <IconButton 
            onClick={onClose}
            className="close-button"
          >
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="delete-content">
            <FaExclamationTriangle className="warning-icon" />
            <Typography variant="h6" component="div">
              Are you sure you want to delete this user?
            </Typography>
            <Typography variant="body1">
              <strong>{username}</strong> will be permanently removed from the system. This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={onClose} className="cancel-button">
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            variant="contained" 
            color="error"
            className="delete-confirm-button"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }