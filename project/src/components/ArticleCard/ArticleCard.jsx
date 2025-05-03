import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ArticleCard.css';

function ArticleCard({ article }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Link to={`/article/${article.id}`} className="article-card-link">
      <div 
        className={`article-card ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="article-image-container">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="article-image"
          />
          <div className="article-category">{article.category}</div>
        </div>
        <div className="article-content">
          <h3 className="article-title">{article.title}</h3>
          <p className="article-excerpt">{article.excerpt}</p>
          <div className="article-meta">
            <div className="author-info">
              <img 
                src={article.authorImage} 
                alt={article.author} 
                className="author-image"
              />
              <span className="author-name">{article.author}</span>
            </div>
            <div className="article-details">
              <span className="article-date">{formatDate(article.date)}</span>
              <span className="article-read-time">{article.readTime}</span>
              <span className="article-likes">♥ {article.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;