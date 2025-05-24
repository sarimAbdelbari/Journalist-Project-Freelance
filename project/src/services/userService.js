import axios from '@/api/axios';

// Get all users (admin access)
export const getAllUsers = async () => {
  try {
    const response = await axios.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by ID (admin access)
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// Get all journalists
export const getJournalists = async () => {
  try {
    const response = await axios.get('/users/journalists');
    return response.data;
  } catch (error) {
    console.error('Error fetching journalists:', error);
    throw error;
  }
};

// Update user (admin access or own profile)
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

// Delete user (admin access)
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// Create a new user (admin access)
export const createUser = async (userData) => {
  try {
    // Using the registration endpoint for new user creation
    const response = await axios.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Fix the getArticlesByIds function
export const getArticlesByIds = async (ids) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    console.log('No valid IDs provided to getArticlesByIds');
    return { success: false, data: [] };
  }
  
  console.log('Fetching articles for IDs:', ids);
  try {
    // Build query string with multiple IDs
    const queryIds = ids.join(',');
    
    // Make sure the URL is correct and matches your backend route
    const response = await axios.get(`/articles/byIds?ids=${queryIds}`);
    
    // Log the raw response for debugging
    console.log('Raw API response:', response);
    
    // Check if the response has the expected structure
    if (response.data && typeof response.data === 'object') {
      return response.data;
    } else {
      console.error('Unexpected response format from API:', response.data);
      return { success: false, data: [], message: 'Invalid response format' };
    }
  } catch (error) {
    console.error('Error fetching articles by IDs:', error);
    return { 
      success: false, 
      data: [], 
      message: error.response?.data?.message || error.message 
    };
  }
};