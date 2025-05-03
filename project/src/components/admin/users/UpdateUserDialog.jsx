import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  IconButton,
  Avatar
} from '@mui/material';
import { MdClose } from 'react-icons/md';
import '@/pages/admin/users/users.css';


export default function UpdateUserDialog({ open, onClose, onSave, user }) {
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    email: '',
    role: 'abonné',
    active: true,
    imagepic: '',
    favorites: []
  });
  
  const [errors, setErrors] = useState({});
  
  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        active: user.active,
        imagepic: user.imagepic || '',
        favorites: user.favorites || []
      });
    }
  }, [user]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'active' ? checked : value
    }));
    
    // Clear error on field change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      className="user-dialog"
    >
      <DialogTitle className="dialog-title">
        Update User
        <IconButton 
          onClick={onClose}
          className="close-button"
        >
          <MdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box className="form-container">
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar 
              src={formData.imagepic} 
              alt={formData.username}
              sx={{ width: 80, height: 80 }}
              className="user-avatar-large"
            >
              {formData.username.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
          
          <TextField
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username}
            required
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="abonné">Abonné</MenuItem>
              <MenuItem value="journaliste">Journaliste</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="imagepic"
            label="Profile Image URL"
            value={formData.imagepic}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="https://example.com/profile.jpg (optional)"
          />
          <FormControlLabel
            control={
              <Switch
                name="active"
                checked={formData.active}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Account Active"
            className="active-switch"
          />
        </Box>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={onClose} className="cancel-button">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          className="save-button"
        >
          Update User
        </Button>
      </DialogActions>
    </Dialog>
  );
}