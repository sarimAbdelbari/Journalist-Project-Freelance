import { useState, useEffect } from 'react';
import { getMyArticles, deleteArticle } from '@/services/articleService';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaRegClock, FaRegCalendarAlt, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { MdPending, MdDoneAll, MdCancel } from 'react-icons/md';
import { error_toast, sucess_toast  } from '@/utils/toastNotification';
import './MyArticles.css';

function MyArticles() {
  const [articles, setArticles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');


  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const response = await getMyArticles(); 

        if (response.success && Array.isArray(response.data)) {
          setArticles(response.data); 
        } else {
          console.error('Failed to fetch articles or data is not an array:', response.message || 'Invalid data format');
          setArticles([]); 
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        error_toast('Failed to load your articles');
        setArticles([]); 
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Get unique categories from all articles
  const uniqueCategories = Array.isArray(articles)
    ? [...new Set(articles.flatMap(article => 
        Array.isArray(article.category) ? article.category : []).filter(cat => typeof cat === 'string' && cat))]
    : [];
  
  const categories = ['all', ...uniqueCategories];
  
  // Filter articles based on search, category, and status
  const filteredArticles = Array.isArray(articles) ? articles.filter(article => {
    const titleMatch = article.title && typeof article.title === 'string' 
      ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) 
      : false;
    
    const contentMatch = article.content && typeof article.content === 'string'
      ? article.content.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    
    const matchesSearch = titleMatch || contentMatch;
    
    const articleCategoriesArray = Array.isArray(article.category) ? article.category : [];
    const matchesCategory = selectedCategory === 'all' || articleCategoriesArray.includes(selectedCategory);
    
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) : [];

  const handleDeleteArticle = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        const response = await deleteArticle(id);
        if (response && response.success) {
          setArticles(prevArticles => prevArticles.filter(article => article._id !== id));
          sucess_toast('Article deleted successfully');
        } else {
          error_toast(response.message || 'Failed to delete article');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        error_toast('An error occurred while deleting the article');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get URL for image
  const getImageUrl = (path) => {
    if (!path) return null;
    // Remove /api from the end of the URL if it exists
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    
    // If path already starts with http or https, return it as is
    if (path.startsWith('http')) return path;
    
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Replace backslashes with forward slashes
    return `${baseUrl}${normalizedPath}`.replace(/\\/g, '/');
  };

  // Parse tags from JSON string
  const parseTags = (tagString) => {
    if (!tagString || !tagString.length) return [];
    
    try {
      if (typeof tagString[0] === 'string' && tagString[0].startsWith('[')) {
        return JSON.parse(tagString[0]);
      }
      return tagString;
    } catch  {
      return tagString;
    }
  };

  // Get status badge style and icon
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return { 
          class: 'status-badge approved',
          icon: <MdDoneAll />,
          text: 'Approved'
        };
      case 'denied':
        return { 
          class: 'status-badge denied',
          icon: <MdCancel />,
          text: 'Denied'
        };
      case 'pending':
      default:
        return { 
          class: 'status-badge pending',
          icon: <MdPending />,
          text: 'Pending'
        };
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading your articles...</div>
      </div>
    );
  }

  return (
    <div className="container my-articles-container">
      <div className="my-articles-header">
        <h2>My Articles</h2>
        <p>Manage and track the status of all your published articles</p>
        
        <Link to="/article/new" className="new-article-btn">
          Write New Article
        </Link>
      </div>

      <div className="article-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search your articles..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-section">
          <div className="filter-group">
            <label>Category:</label>
            <div className="categories">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <div className="status-filters">
              {['all', 'approved', 'pending', 'denied'].map(status => (
                <button
                  key={status}
                  className={`status-button ${selectedStatus === status ? 'active' : ''} ${status !== 'all' ? status : ''}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status === 'all' ? 'All' : 
                    status === 'approved' ? <><MdDoneAll /> Approved</> : 
                    status === 'denied' ? <><MdCancel /> Denied</> : 
                    <><MdPending /> Pending</>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="articles-container">
        {filteredArticles.length > 0 ? (
          <div className="article-cards">
            {filteredArticles.map(article => {
              const statusBadge = getStatusBadge(article.status);
              const tags = parseTags(article.tags);
              
              return (
                <div key={article._id} className="article-card">
                  <div className="article-card-header">
                    <div className={statusBadge.class}>
                      {statusBadge.icon} {statusBadge.text}
                    </div>
                  </div>
                  
                  <div className="article-card-content">
                    <div className="article-image-container">
                      {article.mediaType === 'image' && article.mediaUrl ? (
                        <img 
                          src={getImageUrl(article.mediaUrl)} 
                          alt={article.title} 
                          className="article-image"
                        />
                      ) : (
                        <div className="article-image-placeholder">
                          No image available
                        </div>
                      )}
                    </div>
                    
                    <div className="article-details">
                      <h3 className="article-title">
                        <Link to={`/article/${article._id}`}>{article.title}</Link>
                      </h3>
                      
                      <div className="article-meta">
                        <div className="meta-item">
                          <FaRegCalendarAlt />
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                        <div className="meta-item">
                          <FaRegClock />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="meta-item">
                          <FaRegHeart />
                          <span>{article.likes?.length || 0} likes</span>
                        </div>
                        <div className="meta-item">
                          <FaRegComment />
                          <span>{article.comments?.length || 0} comments</span>
                        </div>
                      </div>
                      
                      <div className="article-info">
                        <div className="category-list">
                          <BiCategory />
                          {article.category?.map((cat, idx) => (
                            <span key={idx} className="article-category">{cat}</span>
                          ))}
                        </div>
                        
                        {tags.length > 0 && (
                          <div className="tag-list">
                            {tags.map((tag, index) => (
                              <span key={index} className="article-tag">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <p className="article-excerpt">
                        {article.content?.substring(0, 150)}
                        {article.content?.length > 150 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="article-actions">
                    <Link to={`/article/${article._id}`} className="view-btn">
                      View Article
                    </Link>
                   <Link to={`/article/edit/${article._id}`} className="edit-btn">
                      <FaEdit /> Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteArticle(article._id, article.title)} 
                      className="delete-btn"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">
            <h3>No articles found</h3>
            <p>No articles match your current filters or you haven&apos;t published any articles yet.</p>
            {(searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}
                className="reset-filters-btn"
              >
                Reset Filters
              </button>
            )}
            <Link to="/article/new" className="new-article-btn">
              Write Your First Article
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyArticles;