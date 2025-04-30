import { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import { getArticles } from '../services/articleService';
import './Home.css';

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await getArticles();
        setArticles(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Derived state for categories
  const categories = ['all', ...new Set(articles.map(article => article.category))];

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="container " style={{ padding: '25px 0px' }}>
      <div className="home-header">
        <h1>Latest Articles</h1>
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
              <ArticleCard key={article.id} article={article} />
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

export default Home;