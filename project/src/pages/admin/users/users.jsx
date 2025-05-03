import { useState } from 'react';
import { 
  DataGrid, 
  GridToolbarFilterButton,
  GridToolbarExport
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

// Dummy user data based on the model
const dummyUsers = [
  {
    id: '1',
    username: 'admin_user',
    email: 'admin@example.com',
    role: 'admin',
    favorites: ['article1', 'article2'],
    imagepic: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    active: true,
    createdAt: '2023-05-15T09:30:00.000Z',
    updatedAt: '2023-07-10T14:20:00.000Z'
  },
  {
    id: '2',
    username: 'john_journalist',
    email: 'john@example.com',
    role: 'journaliste',
    favorites: ['article3'],
    imagepic: 'https://ui-avatars.com/api/?name=John+Journalist&background=2E7D32&color=fff',
    active: true,
    createdAt: '2023-06-01T10:15:00.000Z',
    updatedAt: '2023-06-01T10:15:00.000Z'
  },
  {
    id: '3',
    username: 'sarah_writer',
    email: 'sarah@example.com',
    role: 'journaliste',
    favorites: ['article1', 'article4', 'article5'],
    imagepic: 'https://ui-avatars.com/api/?name=Sarah+Writer&background=C2185B&color=fff',
    active: true,
    createdAt: '2023-06-10T08:45:00.000Z',
    updatedAt: '2023-07-05T11:30:00.000Z'
  },
  {
    id: '4',
    username: 'alex_subscriber',
    email: 'alex@example.com',
    role: 'abonné',
    favorites: ['article2', 'article5'],
    imagepic: null,
    active: true,
    createdAt: '2023-06-15T14:20:00.000Z',
    updatedAt: '2023-06-15T14:20:00.000Z'
  },
  {
    id: '5',
    username: 'maria_reader',
    email: 'maria@example.com',
    role: 'abonné',
    favorites: [],
    imagepic: 'https://ui-avatars.com/api/?name=Maria+Reader&background=F57C00&color=fff',
    active: false,
    createdAt: '2023-06-20T09:10:00.000Z',
    updatedAt: '2023-07-12T10:05:00.000Z'
  },
  {
    id: '6',
    username: 'david_editor',
    email: 'david@example.com',
    role: 'journaliste',
    favorites: ['article3', 'article6'],
    imagepic: 'https://ui-avatars.com/api/?name=David+Editor&background=7B1FA2&color=fff',
    active: true,
    createdAt: '2023-07-01T11:25:00.000Z',
    updatedAt: '2023-07-01T11:25:00.000Z'
  },
  {
    id: '7',
    username: 'lisa_subscriber',
    email: 'lisa@example.com',
    role: 'abonné',
    favorites: ['article1'],
    imagepic: null,
    active: true,
    createdAt: '2023-07-05T13:40:00.000Z',
    updatedAt: '2023-07-05T13:40:00.000Z'
  },
  {
    id: '8',
    username: 'michael_admin',
    email: 'michael@example.com',
    role: 'admin',
    favorites: [],
    imagepic: 'https://ui-avatars.com/api/?name=Michael+Admin&background=0D47A1&color=fff',
    active: true,
    createdAt: '2023-07-10T08:30:00.000Z',
    updatedAt: '2023-07-10T08:30:00.000Z'
  },
  {
    id: '9',
    username: 'emma_reader',
    email: 'emma@example.com',
    role: 'abonné',
    favorites: ['article2', 'article4'],
    imagepic: 'https://ui-avatars.com/api/?name=Emma+Reader&background=E53935&color=fff',
    active: true,
    createdAt: '2023-07-15T10:50:00.000Z',
    updatedAt: '2023-07-15T10:50:00.000Z'
  },
  {
    id: '10',
    username: 'robert_journalist',
    email: 'robert@example.com',
    role: 'journaliste',
    favorites: ['article5', 'article6'],
    imagepic: null,
    active: false,
    createdAt: '2023-07-20T09:15:00.000Z',
    updatedAt: '2023-07-25T14:10:00.000Z'
  }
];

function CustomToolbar() {
  return (
    <Box className="users-toolbar-container">
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </Box>
  );
}

export default function Users() {
  const [users, setUsers] = useState(dummyUsers);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Generate a new unique ID
  const generateId = () => {
    return (Math.max(...users.map(user => parseInt(user.id))) + 1).toString();
  };
  
  // Handle create user
  const handleCreateUser = (userData) => {
    const newUser = {
      ...userData,
      id: generateId(),
      favorites: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    setCreateDialogOpen(false);
  };
  
  // Handle update user
  const handleUpdateUser = (userData) => {
    setUsers(users.map(user => 
      user.id === userData.id ? 
      {...userData, updatedAt: new Date().toISOString()} : user
    ));
    setUpdateDialogOpen(false);
  };
  
  // Handle delete user
  const handleDeleteUser = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setDeleteDialogOpen(false);
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
            src={params.row.imagepic} 
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
        return new Date(params.value).toLocaleString();
      }
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      sortable: false,
      renderCell: (params) => (
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
          <Tooltip title="Delete">
            <IconButton 
              onClick={() => {
                setSelectedUser(params.row);
                setDeleteDialogOpen(true);
              }}
              className="delete-button"
            >
              <FaTrash />
            </IconButton>
          </Tooltip>
        </div>
      )
    },
  ];

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
            slots={{
              toolbar: CustomToolbar,
            }}
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
        />
      )}
    </div>
  );
}