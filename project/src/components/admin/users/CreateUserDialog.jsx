import { useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box
} from '@mui/material';
import { FaTimes } from 'react-icons/fa';

export default function CreateUserDialog({ open, onClose, onSave }) {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'abonné',
    active: true,
    bio: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    let tempErrors = {};
    tempErrors.username = userData.username ? "" : "Username is required";
    tempErrors.email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userData.email) ? 
      "" : "Email is not valid";
    tempErrors.password = userData.password.length >= 6 ? 
      "" : "Password must be at least 6 characters";
    
    setErrors(tempErrors);
    
    return Object.values(tempErrors).every(x => x === "");
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleSwitchChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.checked
    });
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(userData);
      // Reset form
      setUserData({
        username: '',
        email: '',
        password: '',
        role: 'abonné',
        active: true,
        bio: ''
      });
      setErrors({});
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="user-dialog"
    >
      <DialogTitle className="dialog-title">
        Create New User
        <IconButton onClick={onClose} className="close-button">
          <FaTimes />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box className="form-container">
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            error={Boolean(errors.username)}
            helperText={errors.username}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleInputChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={userData.password}
            onChange={handleInputChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={userData.role}
              label="Role"
              onChange={handleInputChange}
            >
              <MenuItem value="abonné">Abonné</MenuItem>
              <MenuItem value="journaliste">Journaliste</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            margin="normal"
            label="Bio"
            name="bio"
            multiline
            rows={3}
            value={userData.bio}
            onChange={handleInputChange}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={userData.active}
                onChange={handleSwitchChange}
                name="active"
                color="primary"
              />
            }
            label="Active Account"
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions className="dialog-actions">
        <Button 
          onClick={onClose} 
          className="cancel-button"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          className="save-button"
        >
          Create User
        </Button>
      </DialogActions>
    </Dialog>
  );
}