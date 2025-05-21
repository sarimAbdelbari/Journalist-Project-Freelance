import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleById, likeArticle } from '@/services/articleService';
import CreateArticle from '@/components/CreateArticle/CreateArticle';
import './Article.css';
import Comments from '@/components/comments/Comments';
import { useStateContext } from '@/contexts/ContextProvider';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { info_toast, sucess_toast, error_toast } from '@/utils/toastNotification';
import { FaArrowLeft } from 'react-icons/fa';
import { CiViewTimeline } from "react-icons/ci";

function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useStateContext();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await getArticleById(id);
        
        if (response.success) {
          setArticle(response.data);
          // Set like count from the likes array
          setLikeCount(response.data.likes.length);
          
          // Check if current user has liked the article
          if (userInfo && response.data.likes.some(like => like._id === userInfo.id)) {
            setIsLiked(true);
          } else {
            setIsLiked(false);
          }
        } else {
          setError(response.message || 'Article not found');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading article:", error);
        setError('Failed to load article. Please try again later.');
        setLoading(false);
      }
    };

    if (id === 'new') {
      setLoading(false);
    } else {
      loadArticle();
    }
  }, [id, userInfo]);

  const handleLikeArticle = async () => {
   

    if (Object.keys(userInfo).length === 0) {
      info_toast("Please login to like articles.");
      return;
    }
    try {
      const response = await likeArticle(id);
      if (response.success) {
        setIsLiked(!isLiked);
        setLikeCount(response.likes);
        sucess_toast(response.message);
      } else {
        error_toast(response.message || "Failed to update like status");
      }
    } catch (error) {
      error_toast("An error occurred while liking the article.");
      console.error("Error liking article:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading article...</div>
      </div>
    );
  }

  if (id === 'new') {
    return (
      <div className="container">
        <CreateArticle />
      </div>
    );
  }

  if (error || !article) {
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

  // Correctly format the image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    // Remove /api from the end of the URL if it exists
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    
    // If path already starts with http or https, return it as is
    if (path.startsWith('http')) return path;
    
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  };

  return (
    <div className="container">
      <article className="article-detail">
        <Link to="/" className="back-link"><FaArrowLeft/> Back to Articles</Link>
        
        <header className="article-header">
          <div className="article-meta-top">
            <span className="article-category">{Array.isArray(article.category) ? article.category.join(', ') : article.category}</span>
            <span className="article-date">{formatDate(article.createdAt)}</span>
            <span className="article-read-time"> <CiViewTimeline />{article.readTime}</span>
          </div>
          
          <h1 className="article-title">{article.title}</h1>
          
          {article.author && (
            <div className="article-author">
              <img 
                src={getImageUrl(article.author.imagepic) || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.username)}&background=random`}
                alt={article.author.username} 
                className="author-image"
              />
              <div className="author-details">
                <span className="author-name">{article.author.username}</span>
                <div className="article-meta-bottom">
                  <button onClick={handleLikeArticle} className={`like-button ${isLiked ? 'liked' : ''}`}>
                    {isLiked ? <FaHeart /> : <FaRegHeart />} {likeCount} likes
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {article.mediaUrl && (
          <div className="article-hero">
            {article.mediaType === 'image' ? (
              <img 
                src={getImageUrl(article.mediaUrl.replace(/\\/g, '/'))}
                alt={article.title} 
                className="article-image"
              />
            ) : article.mediaType === 'video' ? (
              <video controls src={getImageUrl(article.mediaUrl)} className="article-video">
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        )}

        <div className="article-content">
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }}></div>
        </div>
        <div className="article-tags">
          {article.tags && article.tags.length > 0 && article.tags.map((tag, index) => {
            try {
              // Each tag is a string that contains a JSON array
              if (typeof tag === 'string' && tag.startsWith('[')) {
                // Parse the JSON string to get the actual tags array
                const parsedTags = JSON.parse(tag);
                
                // Map over each tag in the parsed array
                return Array.isArray(parsedTags) ? parsedTags.map((t, idx) => (
                  <span key={`${index}-${idx}`} className="article-tag">{t}</span>
                )) : null;
              } else {
                // Fallback for any non-JSON formatted tags
                return <span key={index} className="article-tag">{tag}</span>;
              }
            } catch (e) {
              console.error("Failed to parse tag:", e);
              return <span key={index} className="article-tag">{tag}</span>;
            }
          })}
        </div>
        <div className="article-comments">
          <Comments articleId={id} comments={article.comments}/>
        </div>
      </article>
    </div>
  );
}

export default Article;