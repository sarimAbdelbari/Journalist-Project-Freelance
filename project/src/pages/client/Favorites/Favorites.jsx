import { useState, useEffect } from 'react';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import { getFavArticles } from '@/services/articleService';
import './favorites.css'; 

function Favorites() {
  const [articles, setArticles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const response = await getFavArticles(); 
        if (response.success && Array.isArray(response.data)) {
          setArticles(response.data); 
        } else {
          console.error('Failed to fetch articles or data is not an array:', response.message || 'Invalid data format');
          setArticles([]); 
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setArticles([]); 
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Derived state for categories - FLATTEN and DEDUPLICATE
  const uniqueCategories = Array.isArray(articles)
    ? [...new Set(articles.flatMap(article => Array.isArray(article.category) ? article.category : []).filter(cat => typeof cat === 'string' && cat))]
    : [];
  const categories = ['all', ...uniqueCategories];
  
  // Filter articles based on search and category
  const filteredArticles = Array.isArray(articles) ? articles.filter(article => {
    const titleMatch = article.title && typeof article.title === 'string' ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const excerptContent = article.excerpt || article.content || ''; 
    const excerptMatch = typeof excerptContent === 'string' ? excerptContent.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesSearch = titleMatch || excerptMatch;
    
    const articleCategoriesArray = Array.isArray(article.category) ? article.category : [];
    const matchesCategory = selectedCategory === 'all' || articleCategoriesArray.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  }) : [];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="container " style={{ padding: '40px 0px' }}>
      <div className="favorite-header">
        <h3>Your Favorites Articles</h3>
        <p>Discover thought-provoking journalism from leading writers</p>
      </div>

      <div className="search-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="categories">
          {categories.map(category => (
            <button
              key={category} 
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="articles-container">
        {filteredArticles.length > 0 ? (
          <div className="articles-grid">
            {filteredArticles.map(article => (
              <ArticleCard key={article._id || article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No articles found matching your criteria.</p>
            <button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;