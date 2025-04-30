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
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      if (!isAuthentification || !userInfo?.role) {
        console.log('❌ Not authenticated or no user info');
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      if (allowedRoles.length === 0) {
        console.log('✅ No specific roles required');
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      const hasRequiredRole = allowedRoles.includes(userInfo.role);
      console.log('Current Role:', userInfo.role);
      console.log('Has Required Role:', hasRequiredRole ? '✅' : '❌');
      
      setIsAuthorized(hasRequiredRole);
      setIsChecking(false);
    };

    if (!authLoading) {
      checkAuthorization();
    }
  }, [isAuthentification, userInfo, allowedRoles, authLoading]);

  // Don't render anything while still checking authorization
  if (authLoading || isChecking) {
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