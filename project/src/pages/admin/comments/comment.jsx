import { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  Grid, 
  Card, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress,
  Divider,
  Chip,
  Paper
} from '@mui/material';
import { FaSearch, FaComments } from 'react-icons/fa';
import CommentCard from '@/components/admin/comments/CommentCard';
import axios from '@/api/axios';
import { error_toast } from '@/utils/toastNotification';
import './comment.css';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchAllComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/comments');
        
        if (response.data.success) {
          setComments(response.data.data);
        } else {
          error_toast('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        error_toast('Error loading comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllComments();
  }, []);

  const handleDeleteComment = async (commentId) => {
    try {
      // Optimistically remove from UI
      setComments(prevComments => 
        prevComments.filter(comment => comment._id !== commentId)
      );
      
      // Call API to delete
      await axios.delete(`/comments/${commentId}`);
      
    } catch (error) {
      console.error('Error deleting comment:', error);
      error_toast('Failed to delete comment');
      
      // If there was an error, fetch all comments again to restore the state
      const response = await axios.get('/admin/comments');
      if (response.data.success) {
        setComments(response.data.data);
      }
    }
  };

  // Search and filter logic
  const filteredComments = useMemo(() => {
    return comments.filter(comment => {
      // Check if comment content matches search term
      const contentMatch = comment.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Check if username matches search term
      const usernameMatch = comment.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Check if article title matches search term
      const articleMatch = comment.article?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply search filter
      const matchesSearch = contentMatch || usernameMatch || articleMatch;
      
      // Apply type filter
      if (filterType === 'all') {
        return matchesSearch;
      } else if (filterType === 'recent') {
        // Show comments from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return matchesSearch && new Date(comment.createdAt) >= sevenDaysAgo;
      } else if (filterType === 'popular') {
        // Show comments with likes
        return matchesSearch && comment.likes && comment.likes.length > 0;
      }
      
      return matchesSearch;
    });
  }, [comments, searchTerm, filterType]);

  return (
    <Box className="comments-container">
      <Box className="comments-header">
        <Box className="page-title-container">
          <FaComments className="page-icon" />
          <Typography variant="h4" component="h1" className="page-title">
            Comments Management
          </Typography>
        </Box>
        
        <Card elevation={2} className="stats-card">
          <Box className="stat-item">
            <Typography variant="h5" className="stat-value">
              {comments.length}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Total Comments
            </Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem />
          
          <Box className="stat-item">
            <Typography variant="h5" className="stat-value">
              {comments.filter(c => {
                const threeDaysAgo = new Date();
                threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                return new Date(c.createdAt) >= threeDaysAgo;
              }).length}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Last 3 Days
            </Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem />
          
          <Box className="stat-item">
            <Typography variant="h5" className="stat-value">
              {[...new Set(comments.map(comment => comment.article?._id))].filter(Boolean).length}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Articles with Comments
            </Typography>
          </Box>
        </Card>
      </Box>
      
      <Box className="search-filter-container">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          placeholder="Search comments, users, or article titles..."
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            )
          }}
        />
        
        <FormControl className="filter-select">
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Filter"
          >
            <MenuItem value="all">All Comments</MenuItem>
            <MenuItem value="recent">Recent (7 days)</MenuItem>
            <MenuItem value="popular">Popular (with likes)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Box className="loading-container">
          <CircularProgress />
          <Typography>Loading comments...</Typography>
        </Box>
      ) : filteredComments.length > 0 ? (
        <>
          <Box className="results-summary">
            <Typography variant="body2" color="textSecondary">
              Showing {filteredComments.length} of {comments.length} comments
              {searchTerm && <> matching <strong>{searchTerm}</strong></>}
            </Typography>
          </Box>
          
          <Grid container spacing={3} className="comments-grid">
            {filteredComments.map(comment => (
              <Grid item xs={12} key={comment._id}>
                <CommentCard 
                  comment={comment} 
                  onDelete={() => handleDeleteComment(comment._id)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Paper className="no-results">
          <Typography variant="h6">No comments found</Typography>
          <Typography variant="body2" color="textSecondary">
            {searchTerm ? 
              `No comments match your search for "${searchTerm}"` : 
              "There are no comments in the system yet"}
          </Typography>
          {searchTerm && (
            <Chip 
              label="Clear search" 
              onClick={() => setSearchTerm('')} 
              className="clear-search-chip"
            />
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Comments;