import React, { useState } from 'react';
import { LogIn, Lock, Mail, AlertCircle, Shield, User, Loader2, Radio } from 'lucide-react';
import { loginUser } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser(email, password);
      // Expected response structure: { message, user: { id, email, role }, token }
      if (data && data.token && data.user) {
        onLoginSuccess(data.user, data.token);
      } else {
        setError('Authentication response was invalid.');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot connect to backend server. Make sure it is running on http://localhost:5002.'
          : 'Invalid credentials or login failed.');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-badge">
            <Radio size={22} className="brand-icon" />
          </div>
          <h1 className="login-title">Codveda WebSockets</h1>
          <p className="login-subtitle">
            Level 3 &bull; Task 2 &mdash; Real-Time Socket.IO Notification Gateway
          </p>
        </div>

        {error && (
          <div className="feedback-alert alert-error">
            <AlertCircle size={16} className="feedback-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email Address
            </label>
            <div className="input-group">
              <Mail size={16} className="input-icon" />
              <input
                id="email-input"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <div className="input-group">
              <Lock size={16} className="input-icon" />
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block submit-login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="demo-accounts-section">
          <div className="demo-divider">
            <span>Quick-fill Demo Accounts</span>
          </div>
          <div className="demo-buttons-grid">
            <button
              type="button"
              className="demo-card-btn admin"
              onClick={() => fillCredentials('admin@example.com', 'Admin123!')}
              disabled={isLoading}
            >
              <div className="demo-card-header">
                <Shield size={16} />
                <span className="demo-role">Admin Account</span>
              </div>
              <span className="demo-email">admin@example.com</span>
              <span className="demo-hint">Can send private notifications</span>
            </button>

            <button
              type="button"
              className="demo-card-btn user"
              onClick={() => fillCredentials('user@example.com', 'User123!')}
              disabled={isLoading}
            >
              <div className="demo-card-header">
                <User size={16} />
                <span className="demo-role">Regular User (ID: 2)</span>
              </div>
              <span className="demo-email">user@example.com</span>
              <span className="demo-hint">Receives real-time inbox events</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
