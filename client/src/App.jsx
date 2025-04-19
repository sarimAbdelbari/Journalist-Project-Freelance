import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/login/login";
import HomePage from "@/pages/homePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@/components/providers/theme-provider";
import ArticlesPage from "@/pages/articles/ArticlesPage";
import Jdashboard from "@/pages/Journalist/dashboard/Jdashboard";
import Dashboard from "@/pages/dashboard/dashboard";
import ProtectedRoute from "@/components/providers/protectedRoute";
import { useStateContext } from "./contexts/ContextProvider";
import SidebarWapper from "./components/layout/sidebarwapper";

const App = () => {
  
  const {userInfo } = useStateContext();
  const { theme } = useTheme();
 
   console.log("userInfo" , userInfo)

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
      
   
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<LoginPage />} />

         {/* Protected routes - aboneé */}

        <Route 
        element={
          <ProtectedRoute
              allowedRoles={["abonné" , "journaliste"]}
              redirectPath="/articles"
        />}
        >
          <Route path="/articles" element={<ArticlesPage />} />
        </Route>

    {/* Admin only routes */}
    <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute 
              allowedRoles={['admin']} 
              redirectPath="/dashboard"
            >
              <Dashboard />
            </ProtectedRoute>
          } 
        />


{/* Manager routes */}
       <Route 
          path="/journaliste/dashboard" 
          element={
            <ProtectedRoute 
              allowedRoles={['journaliste']} 
              redirectPath="/journaliste/dashboard"
            >
              <SidebarWapper>

              <Jdashboard />
              </SidebarWapper>
            </ProtectedRoute>
          } 
        />


        </Routes>
     

        
     
    </div>
  );
};

export default App;
