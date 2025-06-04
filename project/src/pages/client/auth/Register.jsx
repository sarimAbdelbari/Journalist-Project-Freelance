import { useState, useRef } from "react"; // Add useRef import
import { useNavigate, Link } from "react-router-dom";
import { info_toast } from "@/utils/toastNotification";
import axios from "@/api/axios";
import { useStateContext } from "@/contexts/ContextProvider";
import logoDark from "@/assets/logoDark.png";
import loginBg from "@/assets/background/loginBg.jpg";
import "@/pages/client/Auth/Auth.css";
import { FaCamera } from "react-icons/fa"; 
import { warn_toast } from '@/utils/toastNotification';

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Add these new states for avatar handling
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null); 
  const avatarInputRef = useRef(null);

  const { setUserInfo } = useStateContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleRoleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value
    }));
  };
  
  // Add this new handler for avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation
      if (!file.type.startsWith("image/")) {
        info_toast("Please select an image file");
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { username, email, password, confirmPassword, role } = formData;

      if (!username || !email || !password || !confirmPassword || !role) {
        info_toast("All fields are required");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        info_toast("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append("username", username);
      formDataToSend.append("email", email);
      formDataToSend.append("password", password);
      formDataToSend.append("role", role);
      
      // Add avatar file if selected
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const response = await axios.post("/auth/register", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data' // Important for file uploads
        }
      });

      setUserInfo(response.data.user);
      navigate("/login");
    } catch (error) {
      info_toast(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { label: "Abonné", value: "abonné" },
    { label: "Journaliste", value: "journaliste" }
  ];

  return (
    <div className="split-register-root">
      {/* Left: Form Area */}
      <div className="split-register-form-area">
        <div className="split-register-form-inner">
          <img src={logoDark} alt="Feather Copywriting" className="split-register-logo" />
          
          {/* Add this avatar upload section */}
          <div className="split-avatar-upload">
            <label htmlFor="avatar-input" className="split-avatar-label">
              {avatarPreviewUrl ? (
                <img
                  src={avatarPreviewUrl}
                  alt="Avatar Preview"
                  className="split-avatar-preview"
                />
              ) : (
                <div className="split-avatar-placeholder">
                  <FaCamera size={24} />
                  <span>Add Photo</span>
                </div>
              )}
            </label>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              ref={avatarInputRef}
              style={{ display: 'none' }}
            />
          </div>
          <h1 className="split-register-heading">Create a new Account</h1>
          <p className="split-register-subtext">Join our community of storytellers and journalists.</p>
          <form className="split-register-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="split-form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
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
                  autoComplete="new-password"
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
            <div className="split-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="split-password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="split-show-hide-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="split-form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={handleRoleChange}
                required
                className="split-form-select"
              >
                <option value="" disabled>Select your role</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="split-register-btn"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <div className="split-register-footer">
            Already have an account? <Link to="/login">Login</Link>
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

export default Register;