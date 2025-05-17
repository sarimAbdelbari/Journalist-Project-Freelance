import { useState, useEffect } from 'react';
import { useStateContext } from '@/contexts/ContextProvider';
import axios from '@/api/axios';
import Cookies from 'js-cookie';

export function useAuth() {
  const {  setUserInfo } = useStateContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists
        const token = Cookies.get('token');
        
        if (!token) {
          setUserInfo(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        const response = await axios.post('/auth/checkAuth');
        
        if (response.data.success) {
          setUserInfo(response.data.user);
          setIsAuthenticated(true);
        } else {
          // Token exists but invalid
          Cookies.remove('token');
          setUserInfo(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        // Consider removing the token if auth check fails
        Cookies.remove('token');
        setUserInfo(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [setUserInfo]);
  
  return { isAuthenticated, isLoading };
}