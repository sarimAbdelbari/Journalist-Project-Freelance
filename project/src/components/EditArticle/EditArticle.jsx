import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById, updateArticle } from '@/services/articleService';
import { useStateContext } from '@/contexts/ContextProvider';
import { error_toast, sucess_toast,  } from '@/utils/toastNotification';
import './EditArticle.css';

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useStateContext();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [article, setArticle] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: [],
    tags: []
  });
  
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [tagInput, setTagInput] = useState('');

  const categories = ['politics', 'business', 'entertainment', 'health', 'science', 'sports', 'technology', 'other'];

  useEffect(() => {
    const loadArticle = async () => {
      if (!userInfo?.id) {
        error_toast('Please login to edit articles');
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await getArticleById(id);
        
        if (response.success && response.data) {
          const articleData = response.data;
          
          // Check if user is the author
          if (articleData.author._id !== userInfo.id) {
            error_toast('You can only edit your own articles');
            navigate('/my-articles');
            return;
          }
          
          setArticle(articleData);
          
          // Parse tags if they're stored as JSON string
          let parsedTags = [];
          if (articleData.tags && articleData.tags.length > 0) {
            try {
              if (typeof articleData.tags[0] === 'string' && articleData.tags[0].startsWith('[')) {
                parsedTags = JSON.parse(articleData.tags[0]);
              } else {
                parsedTags = articleData.tags;
              }
            } catch (e) {
              parsedTags = articleData.tags;
            }
          }
          
          setFormData({
            title: articleData.title || '',
            content: articleData.content || '',
            category: Array.isArray(articleData.category) ? articleData.category : [],
            tags: parsedTags
          });
          
          if (articleData.mediaUrl) {
            setCurrentMedia(articleData.mediaUrl);
          }
        } else {
          error_toast('Article not found');
          navigate('/my-articles');
        }
      } catch (error) {
        console.error('Error loading article:', error);
        error_toast('Failed to load article');
        navigate('/my-articles');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, userInfo, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(cat => cat !== category)
        : [...prev.category, category]
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/mov'];
      if (!validTypes.includes(file.type)) {
        error_toast('Please select a valid image or video file');
        return;
      }

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        error_toast('File size must be less than 50MB');
        return;
      }

      setMediaFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    if (path.startsWith('http')) return path;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`.replace(/\\/g, '/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      error_toast('Title and content are required');
      return;
    }

    if (formData.category.length === 0) {
      error_toast('Please select at least one category');
      return;
    }

    try {
      setSubmitting(true);
      
      const updateData = new FormData();
      updateData.append('title', formData.title);
      updateData.append('content', formData.content);
      
      // Handle categories
      formData.category.forEach(cat => {
        updateData.append('category', cat);
      });
      
      // Handle tags
      if (formData.tags.length > 0) {
        updateData.append('tags', JSON.stringify(formData.tags));
      }
      
      // Handle media file if new one is selected
      if (mediaFile) {
        updateData.append('media', mediaFile);
      }

      const response = await updateArticle(id, updateData);
      
      if (response.success) {
        sucess_toast('Article updated successfully! It will be reviewed before publication.');
        navigate('/my-articles');
      } else {
        error_toast(response.message || 'Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      error_toast('An error occurred while updating the article');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container">
        <div className="error-message">Article not found</div>
      </div>
    );
  }

  return (
    <div className="container edit-article-container">
      <div className="edit-article-header">
        <h2>Edit Article</h2>
        <p>Update your article content. Changes will need to be reviewed before publication.</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-article-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter article title"
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write your article content here..."
            rows="12"
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label>Categories * (Select at least one)</label>
          <div className="category-grid">
            {categories.map(category => (
              <label key={category} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={formData.category.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  disabled={submitting}
                />
                <span className="category-label">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tag-input-container">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              disabled={submitting}
            />
            <button type="button" onClick={handleAddTag} disabled={submitting || !tagInput.trim()}>
              Add Tag
            </button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="tag-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="tag-remove"
                    disabled={submitting}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="media">Media (Image/Video) - Optional</label>
          <input
            type="file"
            id="media"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={submitting}
          />
          
          <div className="media-preview-section">
            {mediaPreview ? (
              <div className="media-preview">
                <h4>New Media Preview:</h4>
                {mediaFile?.type.startsWith('image/') ? (
                  <img src={mediaPreview} alt="Preview" className="preview-image" />
                ) : (
                  <video src={mediaPreview} controls className="preview-video" />
                )}
              </div>
            ) : currentMedia ? (
              <div className="current-media">
                <h4>Current Media:</h4>
                {article.mediaType === 'image' ? (
                  <img src={getImageUrl(currentMedia)} alt="Current" className="preview-image" />
                ) : (
                  <video src={getImageUrl(currentMedia)} controls className="preview-video" />
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/my-articles')}
            className="cancel-btn"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Article'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditArticle;