import  { useState, useRef, useEffect  } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '@/assets/logoDark.png';
import './sidebar.css';
import { FaUser, FaUserTie, FaNewspaper, FaTachometerAlt ,FaComments } from 'react-icons/fa';
import { useStateContext } from '@/contexts/ContextProvider';
import Cookies from 'js-cookie';

const Sidebar = ({children}) => {
  const { userInfo, setUserInfo } = useStateContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('token');
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='dashboard-layout'>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Feather Logo" />
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-link">
            <FaTachometerAlt className="sidebar-icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/dashboard/users" className="sidebar-link">
            <FaUser className="sidebar-icon" />
            <span>Users</span>
          </NavLink>
          <NavLink to="/dashboard/journaliste" className="sidebar-link">
            <FaUserTie className="sidebar-icon" />
            <span>Journalists</span>
          </NavLink>
          <NavLink to="/dashboard/articles" className="sidebar-link">
            <FaNewspaper className="sidebar-icon" />
            <span>Articles</span>
          </NavLink>
          <NavLink to="/dashboard/comments" className="sidebar-link">
            <FaComments className="sidebar-icon" />
            <span>Comments</span>
          </NavLink>
        </nav>
        {/* Profile section at the bottom */}
        <div className="sidebar-profile-section" ref={dropdownRef}>
          <button
            className="sidebar-profile-btn"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {userInfo?.imagepic ? (
              <img
                src={
                  userInfo.imagepic.startsWith('http')
                    ? userInfo.imagepic
                    : `${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')}${userInfo.imagepic}`
                }
                alt="Profile"
                className="sidebar-profile-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInfo?.username || "U");
                }}
              />
            ) : (
              <div className="sidebar-profile-placeholder">
                {userInfo?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </button>
          {dropdownOpen && (
            <div className="sidebar-profile-dropdown">
              <div className="sidebar-profile-info">
                <div className="sidebar-profile-name">{userInfo?.username}</div>
                <div className="sidebar-profile-role">{userInfo?.role}</div>
                <div className="sidebar-profile-email">{userInfo?.email}</div>
              </div>
              <button className="sidebar-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
      <main className="content-area">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;