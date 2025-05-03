import { useState, useEffect } from 'react';
import { useStateContext } from '@/contexts/ContextProvider';
import axios from '@/api/axios';

export function useAuth() {
  const { userInfo, setUserInfo } = useStateContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post('/auth/checkAuth', {}, { withCredentials: true });

        if (response.data.success) {
          setUserInfo(response.data.user);
          setIsAuthenticated(true);
        } else {
          setUserInfo(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setUserInfo(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  return { isAuthenticated, isLoading };
}