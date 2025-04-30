import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Article from './pages/Article'

import { useStateContext } from './contexts/ContextProvider'
import './App.css'
import { ToastContainer } from 'react-toastify'
import Navbar from '@/components/navbar'
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {

  const { userInfo } = useStateContext();

  console.log("userInfo",userInfo)

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
  {/* Auth routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Protected routes */}
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/article/new" element={<Article />} />
    <Route path="/article/:id" element={<Article />} />
    {/* <Route path="/my-articles" element={<MyArticles />} />
    <Route path="/favorites" element={<Favorites />} /> */}
    {/* Other protected routes */}
  </Route>
  
  {/* Fallback */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
        
        {/* <footer>
          <p>© 2025 Feather. All rights reserved.</p>
          </footer> */}
      
          </div>

  )
}

export default App