import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArticles } from '@/services/articleService';
import { getJournalistProfile } from '@/services/journalistService';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import { FaHeart, FaNewspaper, FaEye, FaPlus, FaEdit } from 'react-icons/fa';
import './JournalistProfile.css';
import { useStateContext } from '@/contexts/ContextProvider';

function JournalistProfile() {
  const { id } = useParams();
  const { userInfo } = useStateContext();
  const navigate = useNavigate();
  const [journalist, setJournalist] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const isCurrentUserProfile = userInfo?.id === id || (!id && userInfo?.role === 'journaliste');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load journalist profile
        const journalistData = await getJournalistProfile(id || userInfo?.id);
        setJournalist(journalistData);
        
        // Load all articles for filtering
        const articlesData = await getArticles();
        
        // Filter articles by this journalist
        const journalistArticles = articlesData.filter(
          article => article.authorId === journalistData.id
        );
        
        setArticles(journalistArticles);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load journalist profile');
        setLoading(false);
      }
    };

    if (userInfo) {
      loadData();
    }
  }, [id, userInfo]);

  // Calculate statistics
  const totalArticles = articles.length;
  const totalLikes = articles.reduce((sum, article) => sum + article.likes, 0);
  const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
  
  // Get all categories from articles
  const categories = ['all', ...new Set(articles.map(article => article.category))];
  
  // Filter articles by category
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleCreateArticle = () => {
    navigate('/article/create-article');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (error || !journalist) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="back-link">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container journalist-profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-cover-overlay"></div>
        </div>
        
        <div className="profile-header-content">
          <div className="profile-avatar">
            <img 
              src={journalist.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(journalist.name)} 
              alt={journalist.name}
              className="profile-avatar-img"
            />
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">{journalist.name}</h1>
            <p className="profile-bio">{journalist.bio || "Journalist at Feather News"}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <FaNewspaper className="stat-icon articles-icon" />
                <span className="stat-value">{totalArticles}</span>
                <span className="stat-label">Articles</span>
              </div>
              <div className="stat-item">
                <FaHeart className="stat-icon likes-icon" />
                <span className="stat-value">{totalLikes}</span>
                <span className="stat-label">Likes</span>
              </div>
              <div className="stat-item">
                <FaEye className="stat-icon views-icon" />
                <span className="stat-value">{totalViews}</span>
                <span className="stat-label">Views</span>
              </div>
            </div>
          </div>
          
          {isCurrentUserProfile && (
            <div className="profile-actions">
              <button onClick={handleCreateArticle} className="create-article-btn">
                <FaPlus /> New Article
              </button>
              <button className="edit-profile-btn">
                <FaEdit /> Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Articles Section */}
      <div className="journalist-articles-section">
        <div className="articles-section-header">
          <h2 className="section-title">Published Articles</h2>
          
          {/* Categories filter */}
          <div className="categories">
            {categories.map(category => (
              <button
                key={category}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category === 'all' 
                  ? 'All Categories' 
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Articles grid */}
        {filteredArticles.length > 0 ? (
          <div className="articles-grid">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="no-articles">
            <p>No articles found in this category.</p>
            {selectedCategory !== 'all' && (
              <button 
                onClick={() => setSelectedCategory('all')}
                className="reset-filter-btn"
              >
                Show All Articles
              </button>
            )}
            {isCurrentUserProfile && totalArticles === 0 && (
              <div className="start-writing">
                <p>You haven t published any articles yet.</p>
                <button 
                  onClick={handleCreateArticle}
                  className="start-writing-btn"
                >
                  Start Writing
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalistProfile;