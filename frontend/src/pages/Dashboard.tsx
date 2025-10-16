import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import type { HistoryPoint } from '../App';

interface DashboardProps {
  intakeMl: number;
  dailyGoalMl: number;
  predictionText: string;
  history: HistoryPoint[];
  dailyBuckets: { day: string; ml: number }[];
  connected: boolean;
  statusMsg: string;
  lastSynced: number | null;
  mockMode: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleMock: () => void;
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

const Dashboard: React.FC<DashboardProps> = ({
  intakeMl,
  dailyGoalMl,
  predictionText,
  history,
  dailyBuckets,
  connected,
  statusMsg,
  lastSynced,
  mockMode,
  onConnect,
  onDisconnect,
  onToggleMock
}) => {
  const progressPercentage = dailyGoalMl ? Math.min(100, Math.round((intakeMl / dailyGoalMl) * 100)) : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Track your hydration progress in real-time</p>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-card">
          <div className="progress-header">
            <h3>Today's Progress</h3>
            <div className="status-badge">
              {progressPercentage >= 100 ? 'Goal Achieved!' : 'In Progress'}
            </div>
          </div>
          
          <div className="progress-bar-container">
            <div className="progress-bar-track" style={{ height: '20px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${progressPercentage}%`,
                  height: '100%'
                }}
              />
            </div>
            <div className="progress-text">
              <span>{intakeMl} ml / {dailyGoalMl} ml</span>
              <span>{progressPercentage}%</span>
            </div>
          </div>

          <div className="progress-stats">
            <div className="stat">
              <span className="value">{intakeMl}</span>
              <span className="label">Current Intake</span>
            </div>
            <div className="stat">
              <span className="value">{dailyGoalMl}</span>
              <span className="label">Daily Goal</span>
            </div>
            <div className="stat">
              <span className="value">{dailyGoalMl - intakeMl > 0 ? dailyGoalMl - intakeMl : 0}</span>
              <span className="label">Remaining</span>
            </div>
            <div className="stat">
              <span className="value trend-positive">{progressPercentage}%</span>
              <span className="label">Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💧</div>
          <div className="metric-value">{intakeMl}</div>
          <div className="metric-label">Total Intake (ml)</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-value">{dailyGoalMl}</div>
          <div className="metric-label">Daily Goal (ml)</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-value">{progressPercentage}%</div>
          <div className="metric-label">Progress</div>
        </div>
      </div>

      {/* Device Status */}
      <div className="card">
        <h3>Device Status</h3>
        <div className="quick-actions">
          <button 
            className="action-btn"
            onClick={connected ? onDisconnect : onConnect}
            disabled={mockMode}
          >
            <div className="action-icon">
              <span>{connected ? '🔗' : '📶'}</span>
            </div>
            <div className="action-content">
              <div className="action-label">
                {connected ? 'Disconnect' : 'Connect'} Device
              </div>
              <div className="action-description">
                {connected ? 'Disconnect from smart bottle' : 'Connect to your smart bottle'}
              </div>
            </div>
          </button>
          
          <button className="action-btn" onClick={onToggleMock}>
            <div className="action-icon">
              <span>🎮</span>
            </div>
            <div className="action-content">
              <div className="action-label">
                {mockMode ? 'Disable' : 'Enable'} Demo Mode
              </div>
              <div className="action-description">
                {mockMode ? 'Stop mock data' : 'Test with sample data'}
              </div>
            </div>
          </button>
        </div>
        
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
          <p><strong>Status:</strong> {statusMsg}</p>
          <p><strong>Last synced:</strong> {lastSynced ? formatTime(lastSynced) : '—'}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-container">
        <div className="chart-header">
          <h3>Real-time Intake</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTime} 
              interval="preserveStartEnd"
              stroke="var(--text-muted)"
            />
            <YAxis 
              dataKey="intakeMl"
              stroke="var(--text-muted)"
            />
            <Tooltip 
              labelFormatter={(l: any) => formatTime(l as number)} 
              formatter={(v: any) => [`${v} ml`, 'Intake']}
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="intakeMl" 
              stroke="var(--primary)" 
              strokeWidth={3}
              dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--primary)', strokeWidth: 2 }}
              name="Intake (ml)" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Daily Trends</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyBuckets} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="day"
              stroke="var(--text-muted)"
            />
            <YAxis 
              stroke="var(--text-muted)"
            />
            <Tooltip 
              formatter={(v: any) => [`${v} ml`, 'Daily Intake']}
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Bar 
              dataKey="ml" 
              fill="var(--accent)" 
              name="Daily Intake (ml)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
