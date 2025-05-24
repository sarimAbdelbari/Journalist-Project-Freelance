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

const DeleteArticle = ({ open, onClose, onConfirm, article }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="delete-article-dialog"
    >
      <DialogTitle className="dialog-title">
        Delete Article
        <IconButton onClick={onClose} className="close-button">
          <FaTimes />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="dialog-content">
        <Box className="warning-container">
          <FaExclamationTriangle className="warning-icon" />
          <Typography variant="h6" component="h2" className="warning-title">
            Are you sure you want to delete this article?
          </Typography>
          <Typography variant="body1" className="warning-message">
            You are about to delete the article <strong>{article?.title}</strong>. This action cannot be undone.
          </Typography>
          
          {article?.status === 'approved' && (
            <Typography variant="body2" className="warning-approved">
              This article is currently approved and visible to users!
            </Typography>
          )}
          
          {article?.comments?.length > 0 && (
            <Typography variant="body2" className="warning-comments">
              This article has {article.comments.length} comments that will also be deleted.
            </Typography>
          )}
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
          Delete Article
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteArticle;