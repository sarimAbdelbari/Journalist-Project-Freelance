import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/client/auth/Login'
import Register from './pages/client/auth/Register'
import Home from './pages/client/Home/Home'
import Article from './pages/client/Article/Article'
import 'react-toastify/dist/ReactToastify.css';
import { useStateContext } from './contexts/ContextProvider'
import './App.css'
import { ToastContainer } from 'react-toastify'
import Navbar from '@/components/layout/navbar/navbar'
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'
import ArticleCreate from '@/pages/client/ArticleCreate/ArticleCreate'
import Dashboard from '@/pages/admin/dashboard/Dashboard'
import Sidebar from '@/components/layout/sidebar/sidebar'
import Users from '@/pages/admin/users/users'
import JournalistsList from '@/pages/client/Journalists/JournalistsList'
import UserProfile from '@/pages/client/Profile/UserProfile'
import Favorites from '@/pages/client/Favorites/Favorites'
import MyArticles from '@/pages/client/MyArticles/MyArticles'
import { LoadingPage } from './components/layout/loading/LoadingPage'
import ArticlesTable from './pages/admin/articles/articles'
import Comments from './pages/admin/comments/comment'

// Public layout for both signed-in and unsigned visitors
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};




// Add this new layout function
const JournalistOrSubscriberLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { userInfo } = useStateContext();

  if (isLoading) return <div><LoadingPage/></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if(userInfo.active === false) return <Navigate to="/login" replace />;
  if (userInfo.role !== "journaliste" && userInfo.role !== "abonné") 
    return <Navigate to="/" replace />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};


// Layout for journalist-specific features
const JournalistLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { userInfo } = useStateContext();

  if (isLoading) return <div><LoadingPage/></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
    if(userInfo.active === false) return <Navigate to="/login" replace />;
  if (userInfo.role !== "journaliste") return <Navigate to="/" replace />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

// Layout for admin-specific features
const AdminLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { userInfo } = useStateContext();

  if (isLoading) return <div><LoadingPage/></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
    if(userInfo.active === false) return <Navigate to="/login" replace />;
  if (userInfo.role !== "admin") return <Navigate to="/" replace />;

  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
};

// Layout for any authenticated user (regardless of role)
const AuthenticatedLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div><LoadingPage/></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
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
        {/* Public routes - accessible to everyone */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
      
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/journalists" element={<JournalistsList />} /> {/* Add this component */}
        </Route>

        {/* Routes for any authenticated user */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/profile" element={<UserProfile />} /> {/* Add this component */}
        </Route>

       

        {/* Journalist-specific routes */}
        <Route element={<JournalistLayout />}>
          <Route path="/article/create-article" element={<ArticleCreate />} />
          <Route path="/my-articles" element={<MyArticles />} /> {/* Add this component */}
          <Route path="/profile" element={<UserProfile />} /> {/* Add this component */}
          {/* <Route path="/journalist" element={<JournalistProfile />} /> */}
        </Route>
<Route element={<JournalistOrSubscriberLayout />}>
          <Route path="/profile" element={<UserProfile />} /> {/* Add this component */}

  <Route path="/favorites" element={<Favorites />} />
</Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/users" element={<Users />} />
          <Route path="/dashboard/articles" element={<ArticlesTable />} />
          <Route path="/dashboard/comments" element={<Comments />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;