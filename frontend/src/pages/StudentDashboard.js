import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';
import '../styles/Dashboard.css';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getStudent();
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
        <p>Loading your dashboard...</p>
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

  const { studentInfo, progress, payments, upcomingSessions, recentAssessments, graduation } = data;

  const getBeltColor = (belt) => {
    const colors = {
      white: '#f5f5f5',
      yellow: '#FFD700',
      orange: '#FF8C00',
      red: '#DC143C',
      blue: '#4169E1',
      black: '#2C2C2C'
    };
    return colors[belt] || '#999';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, {user.firstName}! 🎯</h1>
          <p className="subtitle">MAD Journey Student Portal</p>
        </div>
        <button onClick={logout} className="btn-logout">Logout</button>
      </header>

      {/* Student Info & Progress */}
      <div className="stats-grid">
        <div className="stat-card highlight">
          <h3>Current Belt Level</h3>
          <div
            className="belt-display"
            style={{ backgroundColor: getBeltColor(studentInfo.currentBeltLevel) }}
          >
            <span className="belt-text">{studentInfo.currentBeltLevel.toUpperCase()}</span>
          </div>
          <p className="belt-subtitle">Keep up the great work!</p>
        </div>

        <div className="stat-card">
          <h3>Overall Progress</h3>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${studentInfo.progressPercentage}%` }}
              ></div>
            </div>
            <p className="progress-text">{studentInfo.progressPercentage}% Complete</p>
          </div>
          <p className="stat-detail">
            Belt {progress.beltProgress.beltsCompleted} of {progress.beltProgress.totalBelts}
          </p>
        </div>

        <div className="stat-card">
          <h3>Payment Status</h3>
          <div className="payment-progress">
            <div className="big-number">${payments.amountPaid}</div>
            <p>of $1,350 paid</p>
          </div>
          <div className="progress-bar small">
            <div
              className="progress-fill"
              style={{ width: `${progress.paymentProgress.percentage}%` }}
            ></div>
          </div>
          <p className="stat-detail">
            {payments.paid} of {payments.total} payments complete
          </p>
        </div>

        <div className="stat-card">
          <h3>Time Progress</h3>
          <div className="big-number">{progress.timeProgress.daysEnrolled}</div>
          <p>days enrolled</p>
          <div className="progress-bar small">
            <div
              className="progress-fill"
              style={{ width: `${progress.timeProgress.percentage}%` }}
            ></div>
          </div>
          <p className="stat-detail">
            Expected Graduation: {new Date(studentInfo.expectedGraduationDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="section">
        <h2>📅 Upcoming Training Sessions</h2>
        {upcomingSessions && upcomingSessions.length > 0 ? (
          <div className="sessions-grid">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="session-card">
                <h3>{session.sessionName}</h3>
                <div className="session-details">
                  <p>
                    <strong>📅 Date:</strong>{' '}
                    {new Date(session.sessionDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p>
                    <strong>🕐 Time:</strong> {session.startTime} - {session.endTime}
                  </p>
                  {session.location && (
                    <p><strong>📍 Location:</strong> {session.location}</p>
                  )}
                  {session.instructor && (
                    <p>
                      <strong>👨‍🏫 Instructor:</strong>{' '}
                      {session.instructor.firstName} {session.instructor.lastName}
                    </p>
                  )}
                  {session.description && (
                    <p className="session-description">{session.description}</p>
                  )}
                </div>
                <span className={`belt-badge belt-${session.beltLevel}`}>
                  {session.beltLevel.toUpperCase()} LEVEL
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No upcoming sessions scheduled yet.</p>
        )}
      </div>

      {/* Recent Assessments */}
      <div className="section">
        <h2>📝 Recent Assessments</h2>
        {recentAssessments && recentAssessments.length > 0 ? (
          <div className="assessments-list">
            {recentAssessments.map((assessment) => (
              <div key={assessment.id} className="assessment-item">
                <div className="assessment-header">
                  <h4>{assessment.assessmentType.replace(/_/g, ' ').toUpperCase()}</h4>
                  <span className={`badge ${assessment.passed ? 'badge-success' : 'badge-danger'}`}>
                    {assessment.passed ? '✓ PASSED' : '✗ FAILED'}
                  </span>
                </div>
                <div className="assessment-details">
                  <p>
                    <strong>Belt Level:</strong> {assessment.beltLevel.toUpperCase()}
                  </p>
                  <p>
                    <strong>Score:</strong> {assessment.score}%
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(assessment.assessmentDate).toLocaleDateString()}
                  </p>
                  {assessment.feedback && (
                    <p className="feedback"><strong>Feedback:</strong> {assessment.feedback}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No assessments recorded yet.</p>
        )}
      </div>

      {/* Graduation Status */}
      {graduation && (
        <div className="section graduation-section">
          <h2>🎓 Graduation Status</h2>
          <div className="graduation-card">
            <div className="graduation-status">
              <h3>
                {graduation.eligibilityStatus === 'graduated' && '🎉 Congratulations! You\'ve Graduated!'}
                {graduation.eligibilityStatus === 'eligible' && '✨ You\'re Eligible for Graduation!'}
                {graduation.eligibilityStatus === 'not_eligible' && '📚 Keep Training!'}
              </h3>
              {graduation.firearmSelection && (
                <div className="firearm-selected">
                  <p><strong>Selected Firearm:</strong> {graduation.firearmSelection.replace(/_/g, ' ').toUpperCase()}</p>
                  {graduation.firearmDeliveryStatus && (
                    <p><strong>Delivery Status:</strong> {graduation.firearmDeliveryStatus.toUpperCase()}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
