import axios from '@/api/axios';

// Get all articles
export const getArticles = async () => {
  try {
    const response = await axios.get('/articles');
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};


export const getFavArticles = async () => {
  try {
    const response = await axios.get('/articles/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite articles:', error);
    throw error;
  }
}

export const getMyArticles = async () => {
  try {
    const response = await axios.get('/articles/my-articles');
    return response.data;
  } catch (error) {
    console.error('Error fetching my articles:', error);
    throw error;
  }
}

// Get article by ID
export const getArticleById = async (id) => {
  try {
    const response = await axios.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article with ID ${id}:`, error);
    throw error;
  }
};

// Create a new article
export const createArticle = async (articleData) => {
  try {
    const response = await axios.post('/articles', articleData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

// Update an existing article
export const updateArticle = async (id, articleData) => {
  try {
    const response = await axios.put(`/articles/${id}`, articleData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating article with ID ${id}:`, error);
    throw error;
  }
};

// Delete an article
export const deleteArticle = async (id) => {
  try {
    const response = await axios.delete(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting article with ID ${id}:`, error);
    throw error;
  }
};

// Like an article
export const likeArticle = async (id) => {
  try {
    // Note: The backend route for liking is POST /articles/:id/like based on typical REST patterns.
    // Adjust if your actual backend route is different.
    const response = await axios.post(`/articles/${id}/like`);
    return response.data;
  } catch (error) {
    console.error(`Error liking article with ID ${id}:`, error);
    throw error;
  }
};

// Add a comment to an article
export const addComment = async (id, commentData) => {
  try {
    // Note: The backend route for commenting is POST /articles/:id/comments based on typical REST patterns.
    // Adjust if your actual backend route is different.
    const response = await axios.post(`/articles/${id}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to article with ID ${id}:`, error);
    throw error;
  }
};


