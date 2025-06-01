import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Ensure Auth.css is imported (contains the split-register styles)
import './Auth.css';
import { useStateContext } from '@/contexts/ContextProvider';
import axios from '@/api/axios';
import { error_toast, sucess_toast } from '@/utils/toastNotification';
import Cookies from 'js-cookie';
// Import assets
import logoDark from "@/assets/logoDark.png";
import loginBg from "@/assets/background/loginBg.jpg";

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUserInfo } = useStateContext();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { email, password } = formData;

      if (!email || !password) {
        error_toast("Email and password are required");
        setIsLoading(false);
        return;
      }

      const response = await axios.post('/auth/login', {
        email,
        password
      });

      Cookies.set('token', response.data.token, { expires: 7 });
      setUserInfo(response.data.user);
      sucess_toast(response.data.message || "Login successful");
      // Redirect based on role or to a default dashboard
      const userRole = response.data.user?.role;
      if (userRole === 'admin') {
        navigate('/dashboard/users'); // Or journalist specific dashboard
      } else if(!response.data.user?.active) {
        navigate('/Unauthorized'); // Default for 'abonné' or other roles
      } else {
        navigate('/');
      }

    } catch (error) {
      error_toast(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="split-register-root"> {/* Use the same root class */}
      {/* Left: Form Area */}
      <div className="split-register-form-area">
        <div className="split-register-form-inner">
          <img src={logoDark} alt="Feather Copywriting" className="split-register-logo" />
          <h1 className="split-register-heading">Login to your Account</h1>
          <p className="split-register-subtext">Welcome back! Please enter your details.</p>
          <form className="split-register-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="split-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            <div className="split-form-group">
              <label htmlFor="password">Password</label>
              <div className="split-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="split-show-hide-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="split-register-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="split-register-footer">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
      {/* Right: Visual Area */}
      <div
        className="split-register-visual-area"
        style={{
          backgroundImage: `url(${loginBg})`
        }}
      >
        
      </div>
    </div>
  );
}

export default Login;