import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { useStateContext } from '@/contexts/ContextProvider';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ 
  allowedRoles = [], 
  redirectPath = '/login',
  children 
}) => {
  const { isAuthentification, isLoading: authLoading } = useAuth();
  const { userInfo } = useStateContext();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = () => {
      console.log('=== Authorization Check ===');
      console.log('Auth Loading:', authLoading);
      console.log('Is Authenticated:', isAuthentification);
      console.log('User Info:', userInfo);
      console.log('Required Roles:', allowedRoles);
      
      if (!isAuthentification || !userInfo?.role) {
        console.log('❌ Not authenticated or no user info');
        setIsAuthorized(false);
        return;
      }

      if (allowedRoles.length === 0) {
        console.log('✅ No specific roles required');
        setIsAuthorized(true);
        return;
      }

      const hasRequiredRole = allowedRoles.includes(userInfo.role);
      console.log('Current Role:', userInfo.role);
      console.log('Has Required Role:', hasRequiredRole ? '✅' : '❌');
      
      setIsAuthorized(hasRequiredRole);
    };

    if (!authLoading) {
      checkAuthorization();
    }
  }, [isAuthentification, userInfo, allowedRoles, authLoading]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    console.log('❌ Access denied, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  console.log('✅ Access granted');
  return children ? children : <Outlet />;
};

export default ProtectedRoute;