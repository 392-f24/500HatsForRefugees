import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmail, useDbAdd  } from '../utilities/firebase'; 
import './Auth.css';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    
    const [addUserData, addResult] = useDbAdd('users');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSignUp = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setTimeout(() => setError(''), 2000); // Clear error after 2 seconds
        return;
      }
      try {
      // Create user with email and password
      const userCredential = await signUpWithEmail(email, password);

      await addUserData(
        {
          username: username,
          email: userCredential.email,
          provider: userCredential.providerId
        },
        userCredential.uid 
      );

      console.log('Database operation result:', addResult);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/login'); // Redirect to login page
      }, 2000);
    } catch (err) {
        setError(err.message);
        setTimeout(() => setError(''), 2000); // Clear error after 2 seconds
      }
    };
  
    return (
      <div className="page-container-auth-page">
        <div className="auth-page">
          <h2>Sign Up</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-popout">Sign-up successful! Redirecting...</div>} {/* Pop-out */}
          <form onSubmit={handleSignUp}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 10 && !value.includes(' ')) {
                  setUsername(value);
                }
              }}
              placeholder="Enter your username (maxlength 10)"
              required
            />
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
            <button type="submit" className="auth-btn">Sign Up</button>
          </form>
          <p>
            Already have an account? <a href="/#/login">Log In</a>
          </p>
        </div>
      </div>
    );
  };
  
  export default SignUpPage;