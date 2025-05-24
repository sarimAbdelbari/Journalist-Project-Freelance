import { useState, useEffect } from 'react';
import { 
  DataGrid
} from '@mui/x-data-grid';
import { 
  Box, 
  Button, 
  Typography, 
  Avatar, 
  Chip, 
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import { FaPlus, FaEdit, FaTrash, FaEye, FaUsers } from 'react-icons/fa';
import './users.css';
import CreateUserDialog from '@/components/admin/users/CreateUserDialog';
import UpdateUserDialog from '@/components/admin/users/UpdateUserDialog';
import DeleteUserDialog from '@/components/admin/users/DeleteUserDialog';
import ViewUserDialog from '@/components/admin/users/ViewUserDialog';
import { getAllUsers, createUser, updateUser, deleteUser } from '@/services/userService';
import { error_toast, sucess_toast } from '@/utils/toastNotification';
import { useStateContext } from '@/contexts/ContextProvider';
import { LoadingPage } from '../../../components/layout/loading/LoadingPage';



export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { userInfo } = useStateContext();
  
  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        if (response && response.users) {
          // Map backend data to match our frontend structure
          const formattedUsers = response.users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            bio: user.bio,
            favorites: user.favorites || [],
            imagepic: user.imagepic,
            active: user.active,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }));
        
          
          setUsers(formattedUsers);
        } else {
          error_toast('Failed to load users data');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        error_toast('Error loading users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  
  // Handle create user
  const handleCreateUser = async (userData) => {
    try {
      const response = await createUser(userData);
      
      if (response && response.user) {
        const newUser = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          role: response.user.role,
          bio: response.user.bio,
          favorites: response.user.favorites || [],
          imagepic: response.user.imagepic,
          active: response.user.active,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt
        };
        

        setUsers(prevUsers => [...prevUsers, newUser]);
        setCreateDialogOpen(false);
        sucess_toast('User created successfully');
      } else {
        error_toast('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      error_toast(error.response?.data?.message || 'Error creating user');
    }
  };
  
  // Handle update user
  const handleUpdateUser = async (userData) => {
    try {
      const response = await updateUser(userData.id, userData);
      
      if (response && response.user) {
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === userData.id ? {
            ...response.user,
            id: response.user.id
          } : user
        ));
        setUpdateDialogOpen(false);
        sucess_toast('User updated successfully');
      } else {
        error_toast('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      error_toast(error.response?.data?.message || 'Error updating user');
    }
  };
  
  // Handle delete user
  const handleDeleteUser = async () => {
    try {
      // Check if user is trying to delete themselves
      if (selectedUser.id === userInfo.id) {
        error_toast("You cannot delete your own account");
        return;
      }
      
      const response = await deleteUser(selectedUser.id);
      
      if (response) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
        setDeleteDialogOpen(false);
        sucess_toast('User deleted successfully');
      } else {
        error_toast('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      error_toast(error.response?.data?.message || 'Error deleting user');
    }
  };
  
  // Format image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    
    if (path.startsWith('http')) return path;
    
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };
  
  // A more robust date formatter that ensures ISO format compatibility
  const safeDateFormatter = (dateStr) => {
    if (!dateStr) return '—';
    
    try {
      // For ISO format strings, this should work reliably
      const date = new Date(dateStr);

      return date.toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return '—';
    }
  };
  
  // Define columns
  const columns = [
    { 
      field: 'username', 
      headerName: 'Username', 
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div className="username-cell">
          <Avatar 
            src={params.row.imagepic ? getImageUrl(params.row.imagepic) : null} 
            alt={params.row.username}
            className="user-avatar"
          >
            {params.row.username.charAt(0).toUpperCase()}
          </Avatar>
          <span>{params.row.username}</span>
        </div>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1,
      minWidth: 200 
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 150,
      renderCell: (params) => {
        let color;
        switch(params.value) {
          case 'admin':
            color = 'error';
            break;
          case 'journaliste':
            color = 'success';
            break;
          default:
            color = 'primary';
        }
        
        return (
          <Chip 
            label={params.value} 
            color={color} 
            size="small" 
            variant="outlined"
            className="role-chip"
          />
        );
      }
    },
    { 
      field: 'active', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Active' : 'Inactive'} 
          color={params.value ? 'success' : 'default'} 
          size="small"
          className="status-chip"
        />
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Created At', 
      width: 180,
      valueFormatter: (params) => {
        safeDateFormatter(params?.value)
      }
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      sortable: false,
      renderCell: (params) => {
        // Prevent deleting own account
        const isCurrentUser = params.row.id === userInfo?.id;
        
        return (
          <div className="action-buttons">
            <Tooltip title="View">
              <IconButton 
                onClick={() => {
                  setSelectedUser(params.row);
                  setViewDialogOpen(true);
                }}
                className="view-button"
              >
                <FaEye />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton 
                onClick={() => {
                  setSelectedUser(params.row);
                  setUpdateDialogOpen(true);
                }}
                className="edit-button"
              >
                <FaEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title={isCurrentUser ? "Cannot delete your own account" : "Delete"}>
              <span> {/* Wrap in span to allow tooltip on disabled button */}
                <IconButton 
                  onClick={() => {
                    setSelectedUser(params.row);
                    setDeleteDialogOpen(true);
                  }}
                  className="delete-button"
                  disabled={isCurrentUser}
                >
                  <FaTrash />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        );
      }
    },
  ];

  if (loading) {
    return (
      <LoadingPage/>
    );
  }

  return (
    <div className="users-container">
      {/* Page Header with title and add button */}
      <div className="users-header">
        <div className="users-title-container">
          <FaUsers className="users-icon" />
          <Typography variant="h5" component="h1" className="users-title">
            Users Management
          </Typography>
        </div>
        <Button 
          variant="contained"
          startIcon={<FaPlus />}
          onClick={() => setCreateDialogOpen(true)}
          className="add-user-button"
        >
          Add New User
        </Button>
      </div>

      {/* Users count card */}
      <Paper className="users-stats">
        <div className="stat-card">
          <div className="stat-icon admin-icon">
            <FaUsers />
          </div>
          <div className="stat-info">
            <Typography variant="h4" className="stat-value">
              {users.length}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Total Users
            </Typography>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon admin-role-icon">
            <FaUsers />
          </div>
          <div className="stat-info">
            <Typography variant="h4" className="stat-value">
              {users.filter(user => user.role === 'admin').length}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Admins
            </Typography>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon journalist-role-icon">
            <FaUsers />
          </div>
          <div className="stat-info">
            <Typography variant="h4" className="stat-value">
              {users.filter(user => user.role === 'journaliste').length}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Journalists
            </Typography>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon subscriber-role-icon">
            <FaUsers />
          </div>
          <div className="stat-info">
            <Typography variant="h4" className="stat-value">
              {users.filter(user => user.role === 'abonné').length}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Subscribers
            </Typography>
          </div>
        </div>
      </Paper>

      {/* DataGrid */}
      <Paper className="users-table-container">
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
              sorting: {
                sortModel: [{ field: 'username', sort: 'asc' }],
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            autoHeight
            className="users-datagrid"
          />
        </Box>
      </Paper>

      {/* Create User Dialog */}
      <CreateUserDialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreateUser}
      />

      {/* Update User Dialog */}
      {selectedUser && (
        <UpdateUserDialog 
          open={updateDialogOpen} 
          onClose={() => setUpdateDialogOpen(false)}
          onSave={handleUpdateUser}
          user={selectedUser}
        />
      )}

      {/* Delete User Dialog */}
      {selectedUser && (
        <DeleteUserDialog 
          open={deleteDialogOpen} 
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteUser}
          username={selectedUser.username}
        />
      )}

      {/* View User Dialog */}
      {selectedUser && (
        <ViewUserDialog 
          open={viewDialogOpen} 
          onClose={() => setViewDialogOpen(false)}
          user={selectedUser}
          getImageUrl={getImageUrl}
        />
      )}
    </div>
  );
}