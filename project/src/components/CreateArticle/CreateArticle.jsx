import { useState, useRef } from 'react';
import './CreateArticle.css'; // Make sure this CSS file exists and is styled
import { useNavigate } from 'react-router-dom';
import { info_toast, error_toast, sucess_toast } from '@/utils/toastNotification'; // Adjust path if needed
import axios from '@/api/axios'; // Adjust path if needed

function CreateArticle() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
 

  // State management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Added previewUrl state

  // Available categories
  const categories = [
    { label: "Business", value: "business" },
    { label: "Politics", value: "politics" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Health", value: "health" },
    { label: "Science", value: "science" },
    { label: "Sports", value: "sports" },
    { label: "Technology", value: "technology" },
    { label: "Other", value: "other" }
  ];

  // --- Event Handlers ---

  // Handles changes for title and content
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // File handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation (optional: add size/type checks here)
      if (file.size > 50 * 1024 * 1024) { // Example: 50MB limit
         error_toast("File size exceeds 50MB limit.");
         if (fileInputRef.current) {
           fileInputRef.current.value = ""; // Clear the input
         }
         return;
      }
      setSelectedFile(file);

      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Tag management
  const addTag = (e) => {
    e.preventDefault(); // Prevent form submission
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag(""); // Clear input after adding
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Category selection
  const toggleCategory = (categoryValue) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(categoryValue)
        ? prevCategories.filter(c => c !== categoryValue)
        : [...prevCategories, categoryValue]
    );
  };

  // Form submission handler
  const handleSubmit = async (e) => {
     e.preventDefault(); // Prevent default form submission if using <form onSubmit={handleSubmit}>

    // Validation
    if (!formData.title.trim()) {
      info_toast("Title is required");
      return;
    }
    if (!formData.content.trim()) {
      info_toast("Content is required");
      return;
    }
    if (selectedCategories.length === 0) {
      info_toast("Please select at least one category");
      return;
    }

    setIsSubmitting(true);

    // Use FormData for multipart/form-data requests (if backend expects it)
    const articleFormData = new FormData();
    articleFormData.append("title", formData.title);
    articleFormData.append("content", formData.content);

    // Append categories correctly (often as array elements)
    selectedCategories.forEach(category => {
      articleFormData.append("category[]", category); // Adjust key if backend expects different format
    });

    // Append tags (often as a JSON string or array elements)
    // Option 1: JSON string
    if (tags.length > 0) {
       articleFormData.append("tags", JSON.stringify(tags));
    }
    // Option 2: Array elements
    // tags.forEach(tag => {
    //   articleFormData.append("tags[]", tag);
    // });


    // Append media file if selected
    if (selectedFile) {
      articleFormData.append("media", selectedFile); // 'media' should match backend field name
    }

    try {
      // Make API call with FormData
     console.log("Submitting article data:", articleFormData);

      await axios.post("/articles", articleFormData, {
        headers: {
          // Axios might set this automatically for FormData, but explicitly is safer
          "Content-Type": "multipart/form-data",
          // Authorization header if needed (likely handled by axios interceptor)
        }
      });

      sucess_toast("Article created successfully!");

      // Clear form state after successful submission
      setFormData({ title: "", content: "" });
      setTags([]);
      setNewTag("");
      setSelectedCategories([]);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Optional: Navigate away
      navigate('/articles'); // or wherever appropriate

    } catch (error) {
      console.error("Error creating article:", error);
      const errorMessage = error.response?.data?.message || "Failed to create article";
      error_toast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- JSX Structure ---
  return (
    <div className="create-article-container">
      <h2 className="create-article-title">Create New Article</h2>

      {/* Use onSubmit here */}
      <form onSubmit={handleSubmit} className="create-article-form">

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title" // Name attribute is important for handleChange
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter article title"
            required // Add basic HTML validation
          />
          {/* Removed error display as validation is via toasts */}
        </div>

        {/* Content */}
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content" // Name attribute is important for handleChange
            value={formData.content}
            onChange={handleChange}
            rows="12" // Increased rows for better editing
            placeholder="Write your article content here..."
            required // Add basic HTML validation
          />
        </div>

        {/* Categories */}
        <div className="form-group">
          <label>Categories</label>
          <div className="categories-checkbox-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            {categories.map((category) => (
              <div key={category.value} className="category-checkbox-item" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id={`category-${category.value}`}
                  value={category.value}
                  checked={selectedCategories.includes(category.value)}
                  onChange={() => toggleCategory(category.value)}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor={`category-${category.value}`} style={{ fontWeight: 'normal', marginBottom: '0' }}>
                  {category.label}
                </label>
              </div>
            ))}
          </div>
           {/* You could add a visual cue if no category is selected, but toast handles validation */}
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          {/* Sub-form for adding tags */}
          <div className="tag-input-area" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag and press Enter or click Add"
              style={{ flexGrow: 1 }}
              // Optional: Add tag on Enter key press
              onKeyDown={(e) => { if (e.key === 'Enter') addTag(e); }}
            />
            <button type="button" onClick={addTag} className="add-tag-button" style={{ padding: '0 15px', cursor: 'pointer' }}>
              Add
            </button>
          </div>
          {/* Display added tags */}
          <div className="tags-display-area" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <span key={tag} className="tag-badge" style={{ background: '#e5e7eb', padding: '4px 8px', borderRadius: '12px', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    style={{ background: 'none', border: 'none', color: '#6b7280', marginLeft: '4px', cursor: 'pointer', fontSize: '1rem', lineHeight: '1' }}
                    aria-label={`Remove tag ${tag}`}
                  >
                    &times; {/* Simple 'x' character */}
                  </button>
                </span>
              ))
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0' }}>No tags added yet.</p>
            )}
          </div>
        </div>

        {/* Media Upload */}
        <div className="form-group">
          <label htmlFor="media">Cover Media (Image/Video)</label>
          <input
            type="file"
            id="media"
            name="media"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*" // Accept both image and video
          />

          {/* Preview Area */}
          {previewUrl && (
            <div className="image-preview" style={{ position: 'relative', marginTop: '15px' }}>
              {selectedFile?.type.startsWith('image/') ? (
                <img src={previewUrl} alt="Preview" />
              ) : (
                <video src={previewUrl} controls style={{ width: '100%', maxHeight: '300px', display: 'block', borderRadius: 'var(--radius-lg)' }} />
              )}
              <button
                type="button"
                onClick={clearSelectedFile}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px', lineHeight: '24px', textAlign: 'center' }}
                aria-label="Remove media"
              >
                &times;
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Publishing...' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
}

export default CreateArticle;