import { Link } from 'react-router-dom';
import './UnauthorizedAccess.css'; // Optional: for styling

const UnauthorizedAccess = ({ message }) => {
  const defaultMessage = "Your account may have been deactivated or you do not have permission to view this page.";
  const displayMessage = message || defaultMessage;

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1>Access Denied</h1>
        <p>{displayMessage}</p>
        <p>
          If you believe this is an error, please contact support.
        </p>
        <p>
          You can try to <Link to="/login">Login</Link> again 
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;