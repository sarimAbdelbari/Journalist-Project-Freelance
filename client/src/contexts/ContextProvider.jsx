import { createContext, useContext, useState } from 'react';

const StateContext = createContext();



export const ContextProvider = ({ children }) => {

  const [userInfo , setUserInfo] = useState({});
  
  
  

  return (
    <StateContext.Provider
      value={{
        userInfo,
        setUserInfo
      }}
    >
      {children}
    </StateContext.Provider>
  );
};


export const useStateContext = () => useContext(StateContext);
