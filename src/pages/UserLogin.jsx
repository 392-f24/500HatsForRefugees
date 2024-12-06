import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, signInWithGoogle, useDbAdd, getRef } from '../utilities/firebase';
import './Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [addUserData] = useDbAdd('users');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;
      const userExists = await getRef(`users/${user.uid}`);

      if (!userExists) {
        // Add user data to the database
        await addUserData(
          {
            username: user.displayName || 'Google User',
            email: user.email,
            provider: userCredential.providerId || 'google',
          },
          user.uid
        );
      }

      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      setError(err.message);
      console.error('Google Login Error:', err.message);
    }
  };

  const handleAutofill = () => {
    setEmail('margie@123.com');
    setPassword('123456');
  };

  return (
    <div className="page-container-auth-page">
      <div className="auth-page">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="auth-btn">Log In</button>
          <button
            type="button"
            className="auth-btn autofill-btn"
            onClick={handleAutofill}
          >
            Admin Autofill
          </button>
        </form>
        <div className="divider">
          <hr className="line" />
          <span className="or-text">OR</span>
          <hr className="line" />
        </div>
        <div className="social-login">
          <button className="social-icon google" onClick={handleGoogleLogin} aria-label="Sign in with Google">
            <img src="/GoogleSignIn.svg" alt="Google Icon" />
          </button>
        </div>
        <p>
          Don't have an account? <a href="/#/signUp">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;