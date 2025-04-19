import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie';
const LogoutBtn = () => {
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('token');
    }
  };

  return (
    <div>LogoutBtn</div>
  )
}

export default LogoutBtn