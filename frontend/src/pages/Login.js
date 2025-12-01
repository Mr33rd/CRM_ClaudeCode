import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Redirect based on user role
      const { role } = result.user;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'instructor') {
        navigate('/instructor');
      } else if (role === 'student') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@trenttactical.com');
      setPassword('admin123');
    } else if (role === 'instructor') {
      setEmail('instructor@trenttactical.com');
      setPassword('instructor123');
    } else if (role === 'student') {
      setEmail('student1@example.com');
      setPassword('student123');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎯 MAD JOURNEY CRM</h1>
          <p className="tagline">Mindset • Accuracy • Discipline</p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-accounts">
          <p className="demo-title">Demo Accounts (Click to fill):</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn-demo"
              onClick={() => fillDemo('admin')}
            >
              Admin
            </button>
            <button
              type="button"
              className="btn-demo"
              onClick={() => fillDemo('instructor')}
            >
              Instructor
            </button>
            <button
              type="button"
              className="btn-demo"
              onClick={() => fillDemo('student')}
            >
              Student
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
