import { useState, useEffect } from 'react';
import { FaTwitter, FaLinkedin, FaSearch } from 'react-icons/fa';
import axios from '@/api/axios';
import './JournalistsList.css';

const JournalistsList = () => {
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');

  useEffect(() => {
    const loadJournalists = async () => {
      try {
        const response = await axios.get('/users/journalists');
        setJournalists(response.data.journalists);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch journalists:', error);
        setError('Failed to load journalists. Please try again later.');
        setLoading(false);
      }
    };

    loadJournalists();
  }, []);

  // Extract all unique expertise areas
  const allExpertiseAreas = ['all'];
  journalists.forEach(journalist => {
    if (journalist.expertiseAreas) {
      journalist.expertiseAreas.forEach(area => {
        if (!allExpertiseAreas.includes(area)) {
          allExpertiseAreas.push(area);
        }
      });
    }
  });

  // Filter journalists based on search and expertise
  const filteredJournalists = journalists.filter(journalist => {
    const matchesSearch = 
      journalist.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (journalist.bio && journalist.bio.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesExpertise = 
      selectedExpertise === 'all' || 
      (journalist.expertiseAreas && journalist.expertiseAreas.includes(selectedExpertise));
      
    return matchesSearch && matchesExpertise;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExpertiseChange = (expertise) => {
    setSelectedExpertise(expertise);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading journalists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0px' }}>
      <div className="journalists-header">
        <h1>Our Journalists</h1>
        <p>Meet our team of experienced writers and subject matter experts</p>
      </div>
      
      <div className="search-filters">
        <div className="search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search journalists..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
        
        {allExpertiseAreas.length > 1 && (
          <div className="categories expertise-categories">
            {allExpertiseAreas.map(expertise => (
              <button
                key={expertise}
                className={`category-button ${selectedExpertise === expertise ? 'active' : ''}`}
                onClick={() => handleExpertiseChange(expertise)}
              >
                {expertise === 'all' 
                  ? 'All Expertise Areas' 
                  : expertise.charAt(0).toUpperCase() + expertise.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="journalists-container">
        {filteredJournalists.length > 0 ? (
          <div className="journalists-grid">
            {filteredJournalists.map(journalist => (
              <div className="journalist-card" key={journalist.id}>
                <div className="journalist-header">
                  <img 
                    src={
                      journalist.imagepic
                        ? journalist.imagepic.startsWith('http')
                          ? journalist.imagepic
                          : `${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')}${journalist.imagepic}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(journalist.username)}&background=334e68&color=fff&size=150`
                    } 
                    alt={journalist.username}
                    className="journalist-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(journalist.username)}&background=334e68&color=fff&size=150`;
                    }}
                  />
                  <h2 className="journalist-name">{journalist.username}</h2>
                </div>
                
                {journalist.expertiseAreas && journalist.expertiseAreas.length > 0 && (
                  <div className="journalist-expertise">
                    {journalist.expertiseAreas.map(area => (
                      <span key={area} className="expertise-tag">
                        {area.charAt(0).toUpperCase() + area.slice(1)}
                      </span>
                    ))}
                  </div>
                )}
                
                {journalist.bio && <p className="journalist-bio">{journalist.bio}</p>}
                
                <div className="journalist-footer">
                  <div className="journalist-joined">
                    <span>Joined: {new Date(journalist.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="journalist-social">
                    {journalist.socialLinks && journalist.socialLinks.twitter && (
                      <a 
                        href={journalist.socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="social-link twitter"
                      >
                        <FaTwitter />
                      </a>
                    )}
                    {journalist.socialLinks && journalist.socialLinks.linkedin && (
                      <a 
                        href={journalist.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="social-link linkedin"
                      >
                        <FaLinkedin />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No journalists found matching your criteria.</p>
            <button onClick={() => {
              setSearchTerm('');
              setSelectedExpertise('all');
            }} className="reset-btn">
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalistsList;