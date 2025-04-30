import { useEffect, useState } from 'react';
import axios from '@/api/axios';
import { error_toast } from '@/utils/toastNotification';
import { useStateContext } from '@/contexts/ContextProvider';

const useAuth = () => {
  const { setUserInfo } = useStateContext();
  const [isAuthentification, setIsAuthentification] = useState(null); // Changed initial state to null
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await axios.post('/auth/checkAuth', {}, {
          withCredentials: true,
        });
        
        setUserInfo(result.data.user);
        setIsAuthentification(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthentification(false);
        error_toast("Authentication check failed");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [setUserInfo]);
  
  return { isAuthentification, isLoading };
};

export default useAuth;