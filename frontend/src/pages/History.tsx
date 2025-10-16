import React from 'react';
import type { HistoryPoint } from '../App';

interface HistoryProps {
  history: HistoryPoint[];
  dailyBuckets: { day: string; ml: number }[];
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString();
}

const History: React.FC<HistoryProps> = ({ history, dailyBuckets }) => {
  // Get recent history (last 20 entries)
  const recentHistory = history.slice(-20).reverse();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>History</h1>
        <p>View your hydration history and patterns</p>
      </div>

      {/* Daily Summary */}
      <div className="card">
        <h3>Daily Summary</h3>
        <div className="metrics-grid">
          {dailyBuckets.slice(-7).map((bucket, index) => (
            <div key={bucket.day} className="metric-card">
              <div className="metric-icon">📅</div>
              <div className="metric-value">{bucket.ml}</div>
              <div className="metric-label">{bucket.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="card">
        <h3>Recent Activity</h3>
        {recentHistory.length > 0 ? (
          <div className="timeline">
            {recentHistory.map((entry, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-icon">💧</div>
                <div className="timeline-content">
                  <div className="timeline-amount">{entry.intakeMl} ml</div>
                  <div className="timeline-type">Water intake recorded</div>
                </div>
                <div className="timeline-time">
                  {formatTime(entry.timestamp)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📊</span>
            <p>No history data available yet.</p>
            <p>Start tracking your water intake to see your history here!</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="card">
        <h3>Statistics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-value">{history.length}</div>
            <div className="metric-label">Total Records</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">💧</div>
            <div className="metric-value">
              {history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.intakeMl, 0) / history.length) : 0}
            </div>
            <div className="metric-label">Average Intake</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">🏆</div>
            <div className="metric-value">
              {history.length > 0 ? Math.max(...history.map(h => h.intakeMl)) : 0}
            </div>
            <div className="metric-label">Highest Intake</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
