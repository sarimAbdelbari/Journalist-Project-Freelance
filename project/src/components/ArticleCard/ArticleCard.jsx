import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ArticleCard.css';

function ArticleCard({ article }) {

   console.log("article" ,article)

  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Construct image URL, assuming VITE_API_URL is available like in Article.jsx
  // If mediaUrl is already a full URL, you might not need this.
  const imageUrl = article.mediaUrl 
    ? `${import.meta.env.VITE_API_URL.replace('/api','')}/${article.mediaUrl}` 
    : 'default-placeholder-image.jpg'; // Provide a fallback image

  const authorImageUrl = article.author?.imagepic 
    ? `${import.meta.env.VITE_API_URL.replace('/api','')}/${article.author.imagepic}` 
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
          />
          {/* Display first category or join them */}
          <div className="article-category">
            {Array.isArray(article.category) ? article.category[0] : article.category}
          </div>
        </div>
        <div className="article-content">
          <h3 className="article-title">{article.title}</h3>
          <div className="article-meta">
            <div className="author-info">
              <img 
                src={authorImageUrl} 
                alt={article.author?.username || article.author?.name || 'Author'} 
                className="author-image"
              />
              <span className="author-name">{article.author?.username || article.author?.name || 'Unknown Author'}</span>
            </div>
            <div className="article-details">
              <span className="article-date">{formatDate(article.createdAt)}</span>
              <span className="article-read-time">{article.readTime}</span>
              <span className="article-likes">♥ {Array.isArray(article.likes) ? article.likes.length : 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;