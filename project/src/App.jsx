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
import Dashbaord from './pages/admin/Dashbaord'

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { userInfo } = useStateContext();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      {userInfo.role == "journaliste" && (
<>
        
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
        <>
          <Navbar />
          <Outlet />
        </>
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
          {/* Add more routes for journalists and abonnés here, use userInfo.role inside MainLayout if needed */}
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashbaord />} />
          {/* Add admin-specific routes here */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App