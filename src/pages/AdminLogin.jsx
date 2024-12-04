import { useState } from 'react';
import './AdminLogin.css'; // Import CSS for custom styling
import { AdminSignIn } from '../utilities/firebase';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); 
    setShake(false);

    try {
      const result = await AdminSignIn(email, password);
      console.log(result);
      if (result.isAdmin) {
        console.log('Admin login successful:', result.user);
        navigate('/inbox'); 
      }
    } catch (error) {
      setShake(true); 
        setError('Invalid Email/Password');
    }
  };

  return (
    <div className="admin-login-container">
      <div className={`admin-login-card ${shake ? 'shake' : ''}`}>
        <h1 className="admin-login-title">Admin Login</h1>
        <p className="admin-login-subtitle">Enter your credentials to access the admin dashboard.</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />
          </div>
          <button type="submit" className="login-button">Log In</button>
        </form>
        <div className="additional-content">
          {/* Add more content here if needed */}
        </div>
      </div>

      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>
  );
};

export default AdminLogin;
