import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  // Try to initialize from localStorage if available
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      return storedUser ? JSON.parse(storedUser) : {};
    } catch (error) {
      console.error('Error parsing stored user info:', error);
      return {};
    }
  });
  
  // Save userInfo to localStorage whenever it changes
  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length > 0) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  // Enhanced setUserInfo function
  const updateUserInfo = (data) => {
    if (data === null) {
      // Also remove token when clearing user data
      Cookies.remove('token');
      localStorage.removeItem('userInfo');
    }
    setUserInfo(data || {});
  };

  return (
    <StateContext.Provider
      value={{
        userInfo,
        setUserInfo: updateUserInfo
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
