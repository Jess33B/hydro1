import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your app preferences and notifications</p>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h3>Notifications</h3>
        <div className="settings-grid">
          <div className="setting-item">
            <div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Hydration Reminders</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Get reminded to drink water throughout the day
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Goal Achievements</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Celebrate when you reach your daily hydration goal
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Device Connection</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Notifications about device connection status
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="card">
        <h3>Data & Privacy</h3>
        <div className="quick-actions">
          <button className="action-btn">
            <div className="action-icon">
              <span>📊</span>
            </div>
            <div className="action-content">
              <div className="action-label">Export Data</div>
              <div className="action-description">Download your hydration data</div>
            </div>
          </button>
          
          <button className="action-btn">
            <div className="action-icon">
              <span>🗑️</span>
            </div>
            <div className="action-content">
              <div className="action-label">Clear History</div>
              <div className="action-description">Remove all stored data</div>
            </div>
          </button>
        </div>
      </div>

      {/* App Information */}
      <div className="card">
        <h3>About</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>💧</span>
              <strong>Hydration Hero</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Version 1.0.0 - Smart water intake tracking for a healthier lifestyle
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>🛡️</span>
              <strong>Privacy First</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Your data is stored locally on your device and never shared with third parties.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>🌐</span>
              <strong>Web Bluetooth</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Connect to smart water bottles using modern web technologies.
            </p>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="card">
        <h3>Support</h3>
        <div className="quick-actions">
          <button className="action-btn">
            <div className="action-icon">
              <span>📖</span>
            </div>
            <div className="action-content">
              <div className="action-label">User Guide</div>
              <div className="action-description">Learn how to use the app</div>
            </div>
          </button>
          
          <button className="action-btn">
            <div className="action-icon">
              <span>💬</span>
            </div>
            <div className="action-content">
              <div className="action-label">Feedback</div>
              <div className="action-description">Share your thoughts and suggestions</div>
            </div>
          </button>
          
          <button className="action-btn">
            <div className="action-icon">
              <span>🐛</span>
            </div>
            <div className="action-content">
              <div className="action-label">Report Issue</div>
              <div className="action-description">Let us know about any problems</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
