import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/client/Login'
import Register from './pages/client/Register'
import Home from './pages/client/Home'
import Article from './pages/client/Article'
import 'react-toastify/dist/ReactToastify.css';
import { useStateContext } from './contexts/ContextProvider'
import './App.css'
import { ToastContainer } from 'react-toastify'
import Navbar from '@/components/layout/navbar/navbar'
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'
import ArticleCreate from './pages/client/ArticleCreate'
import Dashboard from './pages/admin/dashboard/Dashboard'
import Sidebar from './components/layout/sidebar/sidebar'
import Users from './pages/admin/users/users'
import JournalistProfile from './pages/client/journalistProfile'

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { userInfo } = useStateContext();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      {userInfo.role == "journaliste" && (
<>
<Navbar />
        
        <Outlet />
</>
      )
    }
    </>
  );
};

const AdminLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { userInfo } = useStateContext();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      {/* <Sidebar /> */}
      {userInfo.role == "admin" &&(
        
        <Sidebar>
          <Outlet />
        </Sidebar>
        
      )}
      
    </>
  );
}

function App() {
  // Remove useAuth from here!
  // const { userInfo } = useStateContext();
  // const { isAuthenticated, isLoading } = useAuth();

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
        theme="light"
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Journalist routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/article/create-article" element={<ArticleCreate />} />
          <Route path="/article/new" element={<Article />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/profile/:id?" element={<JournalistProfile />} />
          {/* Add more routes for journalists and abonnés here, use userInfo.role inside MainLayout if needed */}
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/users" element={<Users />} />
          <Route path="/dashboard/journaliste" element={<Dashboard />} />
          <Route path="/dashboard/articles" element={<Dashboard />} />
          <Route path="/dashboard/comments" element={<Dashboard />} />
          {/* Add admin-specific routes here */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App