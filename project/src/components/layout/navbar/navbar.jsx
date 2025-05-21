import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStateContext } from '@/contexts/ContextProvider';
import Cookies from 'js-cookie';
import './navbar.css';
// Icons
import { FaHome, FaNewspaper, FaStar, FaUsers, FaPencilAlt, 
   FaBars, FaTimes, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { MdLogout, MdSettings } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';

// Import logo
import logo from '@/assets/logoDark.png';

const Navbar = () => {
  const { userInfo, setUserInfo } = useStateContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  
const isLoggedIn = (obj) => obj && Object.keys(obj).length > 0;
  
  

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };



  // Get appropriate navigation links based on user role or guest status
  const getNavLinks = () => {
    if (!isLoggedIn(userInfo)) {
      // Navigation links for guests (unsigned visitors)
      return (
        <>
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <FaHome /> <span>Home</span>
          </Link>
          <Link to="/journalists" className={`nav-link ${isActive('/journalists')}`}>
            <FaUsers /> <span>Journalists</span>
          </Link>
          {/* <Link to="/articles" className={`nav-link ${isActive('/articles')}`}>
            <FaNewspaper /> <span>Articles</span>
          </Link> */}
        </>
      );
    }

    // Navigation links for signed-in users based on role
    const role = userInfo?.role;

    if (role === 'abonné') {
      return (
        <>
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <FaHome /> <span>Home</span>
          </Link>
          <Link to="/favorites" className={`nav-link ${isActive('/favorites')}`}>
            <FaStar /> <span>Favorites</span>
          </Link>
          <Link to="/journalists" className={`nav-link ${isActive('/journalists')}`}>
            <FaUsers /> <span>Journalists</span>
          </Link>
        </>
      );
    } else if (role === 'journaliste') {
      return (
        <>
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <FaHome /> <span>Home</span>
          </Link>
          <Link to="/my-articles" className={`nav-link ${isActive('/my-articles')}`}>
            <FaNewspaper /> <span>My Articles</span>
          </Link>
          {/* <Link to="/journalist" className={`nav-link ${isActive('/journalist')}`}>
            <FaUserEdit /> <span>My Profile</span>
          </Link> */}
          <Link to="/favorites" className={`nav-link ${isActive('/favorites')}`}>
            <FaStar /> <span>Favorites</span>
          </Link>
          <Link to="/journalists" className={`nav-link ${isActive('/journalists')}`}>
            <FaUsers /> <span>Journalists</span>
          </Link>
          <Link to="/article/create-article" className={`nav-link ${isActive('/create-article')}`}>
            <FaPencilAlt /> <span>Create Article</span>
          </Link>
        </>
      );
    } else { // For any other role or if role is undefined
      return (
        <>
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <FaHome /> <span>Home</span>
          </Link>
          <Link to="/journalists" className={`nav-link ${isActive('/journalists')}`}>
            <FaUsers /> <span>Journalists</span>
          </Link>
          {/* <Link to="/articles" className={`nav-link ${isActive('/articles')}`}>
            <FaNewspaper /> <span>Articles</span>
          </Link> */}
        </>
      );
    }
  };

  return (
    <nav className="navbar">  
      <div className="navbar-container">
        {/* Logo and brand */}
        <div className="navbar-brand">
          <Link to="/">
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Main Navigation Links */}
        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          {getNavLinks()}
        </div>

        {/* Profile section or Auth buttons */}
        {isLoggedIn(userInfo) ? (
          // Profile dropdown for logged-in users
          <div className="navbar-profile" ref={dropdownRef}>
            <button className="profile-btn" onClick={toggleDropdown}>
              {userInfo?.imagepic ? (
                <img 
                  src={userInfo.imagepic.startsWith('http') 
                    ? userInfo.imagepic 
                    : `${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')}${userInfo.imagepic}`} 
                  alt="Profile" 
                  className="profile-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.username)}&background=random`;
                  }}
                />
              ) : (
                <div className="profile-img-placeholder">
                  {userInfo?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <p className="user-name">{userInfo.username}</p>
                  <p className="user-role">{userInfo.role}</p>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <CgProfile /> Profile
                </Link>
                <Link to="#" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <MdSettings /> Settings
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  <MdLogout /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Authentication buttons for guests
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">
              <FaSignInAlt /> <span>Login</span>
            </Link>
            <Link to="/register" className="register-btn">
              <FaUserPlus /> <span>Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;