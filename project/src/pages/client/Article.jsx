import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleById } from '@/services/articleService';
import CreateArticle from '@/components/CreateArticle/CreateArticle';
import './Article.css';
import Comments from '@/components/comments/Comments';
function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await getArticleById(parseInt(id));
        setArticle(data);
        setLoading(false);
      } catch (error) {
        setError('Article not found');
        setLoading(false);
      }
    };

    if (id === 'new') {
      setLoading(false);
    } else {
      loadArticle();
    }
  }, [id]);

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

  return (
    <div className="container">
      <article className="article-detail">
        <Link to="/" className="back-link">← Back to Articles</Link>
        
        <header className="article-header">
          <div className="article-meta-top">
            <span className="article-category">{article.category}</span>
            <span className="article-date">{formatDate(article.date)}</span>
          </div>
          
          <h1 className="article-title">{article.title}</h1>
          
          <div className="article-author">
            <img 
              src={article.authorImage} 
              alt={article.author} 
              className="author-image"
            />
            <div className="author-details">
              <span className="author-name">{article.author}</span>
              <div className="article-meta-bottom">
                <span className="article-read-time">{article.readTime}</span>
                <span className="article-likes">♥ {article.likes} likes</span>
              </div>
            </div>
          </div>
        </header>

        <div className="article-hero">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="article-image"
          />
        </div>

        <div className="article-content">
          <p className="article-excerpt">{article.excerpt}</p>
          <div className="article-body">
            {article.content}
          </div>
        </div>
        <div className="article-comments">
        <Comments articleId={parseInt(id)}/>
        </div>
      </article>
    </div>
  );
}

export default Article;