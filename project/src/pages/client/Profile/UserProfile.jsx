import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
 
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import {
  FaUser,
  FaEnvelope,
  FaTwitter,
  FaLinkedin,
  FaCamera,
 
  FaSave,
  FaCheckCircle,
  FaTimesCircle,
  FaPen,
  FaUserEdit
} from 'react-icons/fa';
import { useStateContext } from '@/contexts/ContextProvider';
import axios from '@/api/axios';
import { sucess_toast, error_toast } from '@/utils/toastNotification';
import './UserProfile.css';

const UserProfile = () => {
  const { userInfo, setUserInfo } = useStateContext();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  

  // Form fields
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    twitter: '',
    linkedin: ''
  });

  // Original data for comparison (to enable/disable save button)
  const [originalData, setOriginalData] = useState({});

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      

      try {
        setLoading(true);
        const response = await axios.get(`/users/${userInfo.id}`);
        
        console.log("response",response.data)
        if (response.data && response.data.user) {
          const userData = response.data.user;
          
            

          setFormData({
            username: userData.username || '',
            email: userData.email || '',
            bio: userData.bio || '',
            twitter: userData.socialLinks?.twitter || '',
            linkedin: userData.socialLinks?.linkedin || ''
          });
          
          setOriginalData({
            username: userData.username || '',
            email: userData.email || '',
            bio: userData.bio || '',
            twitter: userData.socialLinks?.twitter || '',
            linkedin: userData.socialLinks?.linkedin || ''
          });
          
          // Set avatar preview
          if (userData.imagepic) {
            const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || '';
            const avatarUrl = userData.imagepic.startsWith('http') 
              ? userData.imagepic 
              : `${baseUrl}${userData.imagepic.startsWith('/') ? '' : '/'}${userData.imagepic}`;
            setAvatarPreview(avatarUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Failed to load your profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userInfo,setUserInfo]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      error_toast('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error_toast('Image size should not exceed 5MB');
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Save profile changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (updating) return;
    
    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      setUpdating(true);
      


   const formToSendData = {
      userId: userInfo.id,
      username: formData.username,
      email: formData.email,
      bio: formData.bio || '',
      socialLinks:{
        twitter: formData.twitter || '',
        linkedin: formData.linkedin || ''
      },
    };



      // CHANGE THIS LINE FROM axios.post TO axios.put
      const response = await axios.put('/users/profile', formToSendData); 
      
      if (response.data && response.data.user) {
        // Update context with new user data
        setUserInfo(prev => ({
          ...prev,
          username: response.data.user.username,
          email: response.data.user.email,
          imagepic: response.data.user.imagepic
        }));
        
        // Update original data
        setOriginalData({
          username: formData.username,
          email: formData.email,
          bio: formData.bio || '',
          twitter: formData.twitter || '',
          linkedin: formData.linkedin || ''
        });
        
        // Reset avatar file after successful upload
        setAvatarFile(null);
        
        setSuccessMessage('Profile updated successfully');
        sucess_toast('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const message = error.response?.data?.message || 'Failed to update profile';
      setErrorMessage(message);
      error_toast(message);
    } finally {
      setUpdating(false);
    }
  };

  // Check if form data has changed from original
  const hasChanges = () => {
    return formData.username !== originalData.username ||
      formData.email !== originalData.email ||
      formData.bio !== originalData.bio ||
      formData.twitter !== originalData.twitter ||
      formData.linkedin !== originalData.linkedin ||
      avatarFile !== null;
  };

  // Get avatar URL for display
  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    
    if (userInfo?.imagepic) {
      const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || '';
      return userInfo.imagepic.startsWith('http') 
        ? userInfo.imagepic 
        : `${baseUrl}${userInfo.imagepic.startsWith('/') ? '' : '/'}${userInfo.imagepic}`;
    }
    
    return null;
  };

  if (loading) {
    return (
      <Box className="profile-loading-container">
        <CircularProgress size={40} />
        <Typography variant="body1">Loading your profile...</Typography>
      </Box>
    );
  }

  return (
    <Container className="profile-container">
      <Paper elevation={2} className="profile-paper">
        <Box className="profile-header">
          <Typography variant="h4" component="h1" className="profile-title">
            <FaUserEdit className="profile-icon" />
            Profile Settings
          </Typography>
          <Chip 
            label={userInfo?.role?.charAt(0).toUpperCase() + userInfo?.role?.slice(1)} 
            color={
              userInfo?.role === 'admin' 
                ? 'error' 
                : userInfo?.role === 'journaliste' 
                  ? 'primary' 
                  : 'default'
            }
            className="role-chip"
          />
        </Box>

        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          className="profile-tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab 
            icon={<FaUser />} 
            label="Personal Info" 
            iconPosition="start" 
            className="profile-tab"
          />
          <Tab 
            icon={<FaPen />} 
            label="Bio & Social" 
            iconPosition="start" 
            className="profile-tab"
          />
        </Tabs>

        {successMessage && (
          <Alert 
            severity="success" 
            className="profile-alert"
            onClose={() => setSuccessMessage('')}
            icon={<FaCheckCircle />}
          >
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert 
            severity="error" 
            className="profile-alert"
            onClose={() => setErrorMessage('')}
            icon={<FaTimesCircle />}
          >
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="tab-content">
            {/* Tab 1: Personal Info */}
            {activeTab === 0 && (
              <Grid container spacing={3} className="profile-grid">
                <Grid item xs={12} md={4} className="avatar-section">
                  <Box className="avatar-container">
                    <Avatar 
                      src={getAvatarUrl()} 
                      alt={userInfo?.username || "User"}
                      className="profile-avatar"
                    >
                      {!getAvatarUrl() && (userInfo?.username?.charAt(0).toUpperCase() || 'U')}
                    </Avatar>
                    <Button 
                      variant="contained" 
                      className="change-avatar-btn"
                      onClick={handleAvatarClick}
                      startIcon={<FaCamera />}
                    >
                      Change Photo
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <Typography variant="caption" className="avatar-help-text">
                      Click to upload a new profile picture (max 5MB)
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Box className="personal-info-fields">
                    <Typography variant="h6" className="section-title">
                      <FaUser className="section-icon" />
                      Personal Information
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      margin="normal"
                      required
                      InputProps={{
                        startAdornment: <FaUser className="input-icon" />
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
                      required
                      InputProps={{
                        startAdornment: <FaEnvelope className="input-icon" />
                      }}
                    />
                    
                  </Box>
                </Grid>
              </Grid>
            )}

            {/* Tab 2: Bio & Social */}
            {activeTab === 1 && (
              <Grid container spacing={3} className="profile-grid">
                <Grid item xs={12}>
                  <Typography variant="h6" className="section-title">
                    <FaPen className="section-icon" />
                    Biography
                  </Typography>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Your Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    margin="normal"
                    placeholder={
                      userInfo?.role === 'journaliste' 
                        ? "Share information about your journalism background, expertise, and interests..."
                        : "Tell others about yourself..."
                    }
                    helperText="Your bio will be visible on your public profile"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" className="section-title">
                    Social Links
                  </Typography>
                  <Typography variant="body2" className="social-subtitle">
                    Connect your social media accounts to your profile
                  </Typography>
                  
                  <Box className="social-fields">
                    <TextField
                      fullWidth
                      label="Twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      margin="normal"
                      placeholder="Your Twitter username/link"
                      InputProps={{
                        startAdornment: <FaTwitter className="input-icon twitter-icon" />
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="LinkedIn"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      margin="normal"
                      placeholder="Your LinkedIn profile URL"
                      InputProps={{
                        startAdornment: <FaLinkedin className="input-icon linkedin-icon" />
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            )}
          </div>

          <Divider className="form-divider" />

          <Box className="form-actions">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="save-button"
              disabled={updating || !hasChanges()}
              startIcon={updating ? <CircularProgress size={20} /> : <FaSave />}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default UserProfile;