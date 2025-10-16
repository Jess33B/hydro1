import React from 'react';
import type { ActivityLevel } from '../App';

interface ProfileProps {
  weightKg: number;
  age: number | '';
  activity: ActivityLevel;
  darkMode: boolean;
  onWeightChange: (weight: number) => void;
  onAgeChange: (age: number | '') => void;
  onActivityChange: (activity: ActivityLevel) => void;
  onThemeChange: (darkMode: boolean) => void;
}

const Profile: React.FC<ProfileProps> = ({
  weightKg,
  age,
  activity,
  darkMode,
  onWeightChange,
  onAgeChange,
  onActivityChange,
  onThemeChange
}) => {
  const dailyGoalMl = weightKg > 0 ? Math.round(weightKg * 35) : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Customize your hydration settings and preferences</p>
      </div>

      {/* Profile Information */}
      <div className="card">
        <h3>Personal Information</h3>
        <div className="profile-form">
          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input 
              className="form-input"
              type="number" 
              min={1} 
              value={weightKg}
              onChange={e => onWeightChange(parseFloat(e.target.value) || 0)} 
              placeholder="Enter your weight"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Age (optional)</label>
            <input 
              className="form-input"
              type="number" 
              min={0} 
              value={age}
              onChange={e => onAgeChange(e.target.value === '' ? '' : parseInt(e.target.value))} 
              placeholder="Enter your age"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Activity Level</label>
            <select 
              className="form-select"
              value={activity} 
              onChange={e => onActivityChange(e.target.value as ActivityLevel)}
            >
              <option value="low">Low Activity - Sedentary lifestyle</option>
              <option value="moderate">Moderate Activity - Regular exercise</option>
              <option value="high">High Activity - Intense training</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hydration Goal */}
      <div className="card">
        <h3>Your Hydration Goal</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">🎯</div>
            <div className="metric-value">{dailyGoalMl}</div>
            <div className="metric-label">Daily Goal (ml)</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">🥤</div>
            <div className="metric-value">{Math.round(dailyGoalMl / 250)}</div>
            <div className="metric-label">Glasses per Day</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">⏰</div>
            <div className="metric-value">{Math.round(dailyGoalMl / 16 / 60)}</div>
            <div className="metric-label">ml per Hour</div>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            💡 Your daily hydration goal is calculated based on your weight (35ml per kg). 
            Activity level helps determine additional hydration needs during exercise.
          </p>
        </div>
      </div>

      {/* App Preferences */}
      <div className="card">
        <h3>App Preferences</h3>
        <div className="settings-grid">
          <div className="setting-item">
            <div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Theme</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Choose your preferred app theme
              </div>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => onThemeChange(!darkMode)}
            >
              <span>{darkMode ? '☀️' : '🌙'}</span>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="card">
        <h3>Hydration Tips</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>💧</span>
              <strong>Start Your Day Right</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Drink a glass of water first thing in the morning to kickstart your hydration.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>🏃</span>
              <strong>Exercise Hydration</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Drink extra water before, during, and after exercise to replace fluids lost through sweat.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>⏰</span>
              <strong>Regular Intervals</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Sip water regularly throughout the day rather than drinking large amounts at once.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
