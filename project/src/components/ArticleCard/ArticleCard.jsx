import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegCalendarAlt, FaRegClock, FaRegHeart } from 'react-icons/fa';
import './ArticleCard.css';

function ArticleCard({ article }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Properly format image URLs
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
      : '';
      
    // Handle both forward and backslashes in paths
    const normalizedPath = path.replace(/\\/g, '/');
    return `${baseUrl}/${normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath}`;
  };

  const imageUrl = article.mediaUrl 
    ? getImageUrl(article.mediaUrl)
    : 'https://via.placeholder.com/800x450?text=No+Image'; 

  const authorImageUrl = article.author?.imagepic 
    ? getImageUrl(article.author.imagepic)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author?.username || 'A N')}&background=random`;

  return (
    <Link to={`/article/${article._id}`} className="article-card-link">
      <div 
        className={`article-card ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="article-image-container">
          <img 
            src={imageUrl} 
            alt={article.title} 
            className="article-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x450?text=Image+Error';
              e.target.onerror = null; // Prevent infinite error loop
            }}
          />
          
          {/* Show multiple categories */}
          {Array.isArray(article.category) && article.category.length > 0 ? (
            <div className="article-category">
              {article.category[0]}
              {article.category.length > 1 && `+${article.category.length - 1}`}
            </div>
          ) : (
            article.category && <div className="article-category">{article.category}</div>
          )}
        </div>
        
        <div className="article-content">
          <h3 className="article-title">{article.title}</h3>
          
          {article.content && (
            <p className="article-excerpt">
              {article.content.substring(0, 120)}
              {article.content.length > 120 ? '...' : ''}
            </p>
          )}
          
          <div className="article-meta">
            <div className="author-info">
              <img 
                src={authorImageUrl} 
                alt={article.author?.username || article.author?.name || 'Author'} 
                className="author-image"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author?.username || 'A')}&background=random`;
                }}
              />
              <span className="author-name" title={article.author?.username || article.author?.name}>
                {article.author?.username || article.author?.name || 'Unknown Author'}
              </span>
            </div>
            
            <div className="article-details">
              <span className="article-date">
                <FaRegCalendarAlt />
                {formatDate(article.createdAt)}
              </span>
              <span className="article-read-time">
                <FaRegClock />
                {article.readTime}
              </span>
              <span className="article-likes">
                <FaRegHeart />
                {Array.isArray(article.likes) ? article.likes.length : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;