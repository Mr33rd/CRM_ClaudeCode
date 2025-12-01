import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';
import '../styles/Dashboard.css';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getAdmin();
      setData(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={loadDashboard}>Retry</button>
      </div>
    );
  }

  if (!data) return null;

  const { students, revenue, beltDistribution, sessions, instructors, graduations } = data;

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard 🎯</h1>
          <p className="subtitle">MAD Journey CRM - System Overview</p>
        </div>
        <button onClick={logout} className="btn-logout">Logout</button>
      </header>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Total Students</h3>
            <div className="metric-value">{students.total}</div>
            <p className="metric-detail">
              {students.active} active • {students.graduates} graduated
            </p>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <div className="metric-value">${revenue.total?.toLocaleString() || 0}</div>
            <p className="metric-detail">
              ${revenue.monthly?.toLocaleString() || 0} this month
            </p>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <h3>Overdue</h3>
            <div className="metric-value">${revenue.overdue?.toLocaleString() || 0}</div>
            <p className="metric-detail">Requires attention</p>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">🎓</div>
          <div className="metric-content">
            <h3>Graduations</h3>
            <div className="metric-value">{graduations.eligible}</div>
            <p className="metric-detail">Students eligible</p>
          </div>
        </div>
      </div>

      {/* Student Overview */}
      <div className="section">
        <h2>📊 Student Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Active Students</h4>
            <div className="big-number">{students.active}</div>
          </div>
          <div className="stat-card">
            <h4>Withdrawn</h4>
            <div className="big-number">{students.withdrawn}</div>
          </div>
          <div className="stat-card">
            <h4>Graduates</h4>
            <div className="big-number">{students.graduates}</div>
          </div>
          <div className="stat-card">
            <h4>New (30 days)</h4>
            <div className="big-number">{students.recentEnrollments}</div>
          </div>
        </div>
      </div>

      {/* Belt Distribution */}
      <div className="section">
        <h2>🥋 Belt Distribution</h2>
        <div className="belt-distribution">
          {Object.entries(beltDistribution).map(([belt, count]) => (
            <div key={belt} className="belt-stat">
              <div className={`belt-badge belt-${belt}`}>
                {belt.toUpperCase()}
              </div>
              <div className="belt-count">{count} students</div>
              <div className="belt-bar">
                <div
                  className="belt-bar-fill"
                  style={{
                    width: `${(count / students.active) * 100}%`,
                    backgroundColor: getBeltColor(belt)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="section">
        <h2>💵 Revenue Breakdown</h2>
        <div className="stats-grid">
          <div className="stat-card highlight">
            <h4>Total Collected</h4>
            <div className="big-number green">${revenue.total?.toLocaleString() || 0}</div>
            <p>All-time revenue</p>
          </div>
          <div className="stat-card">
            <h4>This Month</h4>
            <div className="big-number blue">${revenue.monthly?.toLocaleString() || 0}</div>
            <p>Current month</p>
          </div>
          <div className="stat-card">
            <h4>Pending</h4>
            <div className="big-number orange">${revenue.pending?.toLocaleString() || 0}</div>
            <p>Expected payments</p>
          </div>
          <div className="stat-card">
            <h4>Overdue</h4>
            <div className="big-number red">${revenue.overdue?.toLocaleString() || 0}</div>
            <p>Requires follow-up</p>
          </div>
        </div>
      </div>

      {/* Sessions & Instructors */}
      <div className="two-column-section">
        <div className="section">
          <h2>📅 Sessions</h2>
          <div className="info-box">
            <p><strong>Total Sessions:</strong> {sessions.total}</p>
            <p><strong>Upcoming:</strong> {sessions.upcoming}</p>
          </div>
        </div>

        <div className="section">
          <h2>👨‍🏫 Instructors</h2>
          <div className="info-box">
            <p><strong>Active Instructors:</strong> {instructors.total}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2>⚡ Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => window.location.href = '/students'}>
            View All Students
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/payments'}>
            Manage Payments
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/sessions'}>
            Schedule Session
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/reports'}>
            Generate Reports
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function for belt colors
function getBeltColor(belt) {
  const colors = {
    white: '#f5f5f5',
    yellow: '#FFD700',
    orange: '#FF8C00',
    red: '#DC143C',
    blue: '#4169E1',
    black: '#2C2C2C'
  };
  return colors[belt] || '#999';
}

export default AdminDashboard;
