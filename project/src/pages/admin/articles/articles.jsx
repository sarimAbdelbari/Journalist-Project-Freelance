import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField,
  InputAdornment,
  Card, 
  Chip, 
  IconButton, 
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  FaSearch, 
  FaEye, 
  FaTrashAlt, 
  FaNewspaper,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaHourglass,
  FaThumbsUp,
  FaComment
} from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
import axios from '@/api/axios';
import { error_toast, sucess_toast } from '@/utils/toastNotification';
import ViewArticle from '@/components/admin/articles/ViewArticle';
import DeleteArticle from '@/components/admin/articles/DeleteArticle';
import './articles.css';

const ArticlesTable = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  // Load articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // Fetch all articles, including pending ones
        // Note: You may need to create a new endpoint for admin to see all articles regardless of status
        const response = await axios.get('/articles/all');
        
        if (response.data && response.data.success) {
          setArticles(response.data.data.map(article => ({
            ...article,
            id: article._id, // Ensure each row has an id property for DataGrid
            authorName: article.author?.username || 'Unknown',
            commentCount: article.comments?.length || 0,
            likeCount: article.likes?.length || 0
          })));
        } else {
          error_toast('Failed to load articles');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        error_toast('Error loading articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Handle status change
  const handleStatusChange = async (articleId, newStatus) => {
    try {
      // First, update the UI optimistically
      setArticles(prevArticles => prevArticles.map(article => 
        article.id === articleId ? { ...article, status: newStatus } : article
      ));
      
      // Then make the API call to update status
      const response = await axios.put(`/articles/${articleId}/status`, { status: newStatus });
      
      if (response.data && response.data.success) {
        sucess_toast(`Article ${newStatus}`);
      } else {
        // If there was an error, revert the change
        setArticles(prevArticles => {
          const originalArticle = prevArticles.find(a => a.id === articleId);
          return prevArticles.map(article => 
            article.id === articleId ? { ...article, status: originalArticle.status } : article
          );
        });
        error_toast('Failed to update article status');
      }
    } catch (error) {
      console.error('Error updating article status:', error);
      error_toast('Error updating article status');
      // Revert the change
      setArticles(prevArticles => [...prevArticles]);
    }
  };

  // Handle article deletion
  const handleDeleteArticle = async (articleId) => {
    try {
      // Close the dialog first
      setDeleteDialogOpen(false);
      
      // Optimistically remove from UI
      setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
      
      // Make the API call
      const response = await axios.delete(`/articles/${articleId}`);
      
      if (response.data && response.data.success) {
        sucess_toast('Article deleted successfully');
      } else {
        // If there was an error, reload the list
        const refreshResponse = await axios.get('/articles/all');
        if (refreshResponse.data && refreshResponse.data.success) {
          setArticles(refreshResponse.data.data.map(article => ({
            ...article,
            id: article._id,
            authorName: article.author?.username || 'Unknown',
            commentCount: article.comments?.length || 0,
            likeCount: article.likes?.length || 0
          })));
        }
        error_toast('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      error_toast('Error deleting article');
      // Reload the list on error
      const refreshResponse = await axios.get('/articles/all');
      setArticles(refreshResponse.data.data.map(article => ({
        ...article,
        id: article._id,
        authorName: article.author?.username || 'Unknown',
        commentCount: article.comments?.length || 0,
        likeCount: article.likes?.length || 0
      })));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '—';
    }
  };

  // Get image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Filter articles based on search term and status filter
  const filteredArticles = articles.filter(article => {
    // Search term filter
    const searchMatch = 
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.authorName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const statusMatch = statusFilter === 'all' || article.status === statusFilter;
    
    // Tab filter
    let tabMatch = true;
    if (tabValue === 1) { // Pending
      tabMatch = article.status === 'pending';
    } else if (tabValue === 2) { // Approved
      tabMatch = article.status === 'approved';
    } else if (tabValue === 3) { // Denied
      tabMatch = article.status === 'denied';
    }
    
    return searchMatch && statusMatch && tabMatch;
  });

  // DataGrid columns
  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2, // Increase flex proportion for title
      minWidth: 180,
      renderCell: (params) => (
        <Box className="title-cell">
          {params.row.mediaUrl && params.row.mediaType === 'image' && (
            <img 
              src={getImageUrl(params.row.mediaUrl)}
              alt={params.row.title}
              className="article-thumbnail"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40?text=Error';
                e.target.onerror = null;
              }}
            />
          )}
          <Typography className="article-title-text" title={params.value}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'authorName',
      headerName: 'Author',
      width: 130, // Slightly reduced
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110, // Slightly reduced
      renderCell: (params) => {
        let color;
        let icon;
        
        switch(params.value) {
          case 'approved':
            color = 'success';
            icon = <FaCheckCircle />;
            break;
          case 'denied':
            color = 'error';
            icon = <FaTimesCircle />;
            break;
          default:
            color = 'warning';
            icon = <FaHourglass />;
        }
        
        return (
          <Chip 
            icon={icon}
            label={params.value.charAt(0).toUpperCase() + params.value.slice(1)} 
            color={color}
            variant="outlined"
            size="small"
            className="status-chip"
          />
        );
      }
    },
    {
      field: 'category',
      headerName: 'Categories',
      width: 160, // Slightly reduced
      renderCell: (params) => {
        // Handle array of categories
        if (Array.isArray(params.value) && params.value.length > 0) {
          return (
            <Box className="categories-cell">
              <Chip 
                label={params.value[0]} 
                size="small"
                className="category-chip"
              />
              {params.value.length > 1 && (
                <Chip 
                  label={`+${params.value.length - 1}`}
                  size="small"
                  className="category-count-chip"
                />
              )}
            </Box>
          );
        }
        return '—';
      }
    },
    {
      field: 'likeCount',
      headerName: 'Likes',
      width: 80, // More compact
      renderCell: (params) => (
        <Box className="count-cell">
          <FaThumbsUp className="count-icon like-icon" />
          <span>{params.value}</span>
        </Box>
      )
    },
    {
      field: 'commentCount',
      headerName: 'Comments',
      width: 100, // Slightly reduced
      renderCell: (params) => (
        <Box className="count-cell">
          <FaComment className="count-icon comment-icon" />
          <span>{params.value}</span>
        </Box>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 110, // Slightly reduced
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 190, // Slightly reduced
      sortable: false,
      renderCell: (params) => (
        <Box className="actions-cell">
          <Tooltip title="View Article">
            <IconButton 
              onClick={() => {
                setSelectedArticle(params.row);
                setViewDialogOpen(true);
              }}
              className="view-button"
              size="small"
            >
              <FaEye />
            </IconButton>
          </Tooltip>
          
          {params.row.status !== 'approved' && (
            <Tooltip title="Approve Article">
              <IconButton 
                onClick={() => handleStatusChange(params.row.id, 'approved')}
                color="success"
                className="approve-button"
                size="small"
              >
                <FaCheckCircle />
              </IconButton>
            </Tooltip>
          )}
          
          {params.row.status !== 'denied' && (
            <Tooltip title="Deny Article">
              <IconButton 
                onClick={() => handleStatusChange(params.row.id, 'denied')}
                color="error"
                className="deny-button"
                size="small"
              >
                <FaTimesCircle />
              </IconButton>
            </Tooltip>
          )}
          
          {params.row.status !== 'pending' && (
            <Tooltip title="Mark as Pending">
              <IconButton 
                onClick={() => handleStatusChange(params.row.id, 'pending')}
                color="warning"
                className="pending-button"
                size="small"
              >
                <FaExclamationTriangle />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Delete Article">
            <IconButton 
              onClick={() => {
                setSelectedArticle(params.row);
                setDeleteDialogOpen(true);
              }}
              color="error"
              className="delete-button"
              size="small"
            >
              <FaTrashAlt />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
  ];

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Count articles by status
  const pendingCount = articles.filter(article => article.status === 'pending').length;
  const approvedCount = articles.filter(article => article.status === 'approved').length;
  const deniedCount = articles.filter(article => article.status === 'denied').length;

  return (
    <Box className="articles-container">
      {/* Header */}
      <Box className="articles-header">
        <Box className="page-title-container">
          <FaNewspaper className="page-icon" />
          <Typography variant="h4" component="h1" className="page-title">
            Articles Management
          </Typography>
        </Box>
        
        {/* Stats Cards */}
        <Card elevation={2} className="stats-card">
          <Box className="stat-item">
            <Typography variant="h5" className="stat-value">
              {articles.length}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Total Articles
            </Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem />
          
          <Box className="stat-item pending-stat">
            <Typography variant="h5" className="stat-value">
              {pendingCount}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Pending
            </Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem />
          
          <Box className="stat-item approved-stat">
            <Typography variant="h5" className="stat-value">
              {approvedCount}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Approved
            </Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem />
          
          <Box className="stat-item denied-stat">
            <Typography variant="h5" className="stat-value">
              {deniedCount}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Denied
            </Typography>
          </Box>
        </Card>
      </Box>
      
      {/* Search and Filter */}
      <Box className="search-filter-container">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          placeholder="Search articles by title, content or author..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" className="status-filter">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="denied">Denied</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Tabs */}
      <Paper className="tabs-container">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Articles" icon={<FaNewspaper />} iconPosition="start" />
          <Tab 
            label={`Pending (${pendingCount})`} 
            icon={<FaHourglass />} 
            iconPosition="start"
            className="pending-tab"
          />
          <Tab 
            label={`Approved (${approvedCount})`} 
            icon={<FaCheckCircle />} 
            iconPosition="start" 
            className="approved-tab"
          />
          <Tab 
            label={`Denied (${deniedCount})`} 
            icon={<FaTimesCircle />} 
            iconPosition="start"
            className="denied-tab"
          />
        </Tabs>
      </Paper>
      
      {/* DataGrid */}
      <Box className="datagrid-outer-container">
        <Paper className="datagrid-container">
          {loading ? (
            <Box className="loading-container">
              <CircularProgress />
              <Typography>Loading articles...</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={filteredArticles}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50, 100]}
              checkboxSelection={false}
              disableSelectionOnClick
              autoHeight
              className="articles-datagrid"
              density="compact"
            />
          )}
        </Paper>
      </Box>
      
      {/* View Article Dialog */}
      {selectedArticle && (
        <ViewArticle
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          article={selectedArticle}
          onStatusChange={(newStatus) => handleStatusChange(selectedArticle.id, newStatus)}
          getImageUrl={getImageUrl}
        />
      )}
      
      {/* Delete Article Dialog */}
      {selectedArticle && (
        <DeleteArticle
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={() => handleDeleteArticle(selectedArticle.id)}
          article={selectedArticle}
        />
      )}
    </Box>
  );
};

export default ArticlesTable;