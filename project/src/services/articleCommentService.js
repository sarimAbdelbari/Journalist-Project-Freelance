import axios from '@/api/axios';

// Get comments for an article
export const getCommentsByArticleId = async (articleId) => {
  try {
    const response = await axios.get(`/articles/${articleId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for article ${articleId}:`, error);
    throw error;
  }
};

// Like a comment
export const likeComment = async (commentId) => {
  try {
    const response = await axios.post(`/comments/${commentId}/like`);
    return response.data;
  } catch (error) {
    console.error(`Error liking comment ${commentId}:`, error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error;
  }
};