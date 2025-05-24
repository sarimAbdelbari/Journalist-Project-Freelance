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
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const CommentDelete = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      className="delete-dialog"
    >
      <DialogTitle className="dialog-title">
        Delete Comment
        <IconButton 
          onClick={onClose}
          className="close-button"
        >
          <FaTimes />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box className="dialog-content">
          <Box className="warning-icon-container">
            <FaExclamationTriangle className="warning-icon" />
          </Box>
          
          <Typography variant="h6" className="confirm-title">
            Are you sure?
          </Typography>
          
          <Typography variant="body1" className="confirm-message">
            This will permanently delete the comment. This action cannot be undone.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions className="dialog-actions">
        <Button 
          onClick={onClose}
          variant="outlined"
          className="cancel-button"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained"
          color="error"
          className="confirm-button"
        >
          Delete Comment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentDelete;