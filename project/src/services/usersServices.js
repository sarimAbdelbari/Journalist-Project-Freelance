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