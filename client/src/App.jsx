import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
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
import Container from "./components/layout/container";
import ArticleCreate from "./components/articles/articleCreate";
import NavBar from "./components/layout/navBar";

// Create a layout component that applies the sidebar wrapper
const JournalistLayout = () => {
  return (
    <Container className="flex flex-col gap-2">
      <NavBar/>
      <Outlet />
    </Container>
  );
};

const App = () => {
  const { userInfo } = useStateContext();
  const { theme } = useTheme();

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
        <Route path="/login" element={<LoginPage />} />

        {/* Role-based redirects */}
        <Route 
          path="/app"
          element={
            userInfo ? (
              userInfo.role === "journaliste" ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/articles" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected routes - abonné */}
        <Route 
          element={
            <ProtectedRoute
              allowedRoles={["abonné", "journaliste"]}
              redirectPath="/login"
            />
          }
        >
          <Route path="/articles" element={
            <Container>
              <ArticlesPage />
            </Container>
          } />
        </Route>

        {/* Journalist routes with shared sidebar */}
        <Route 
          element={
            <ProtectedRoute
              allowedRoles={["journaliste"]}
              redirectPath="/login"
            />
          }
        >
          <Route element={<JournalistLayout />}> 
            <Route index path="/dashboard" element={<Jdashboard />} />
            <Route path="/dashboard/articles/create" element={<ArticleCreate />} />
          </Route>
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
