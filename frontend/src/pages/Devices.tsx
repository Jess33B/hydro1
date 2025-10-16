import React from 'react';

interface DevicesProps {
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

const Devices: React.FC<DevicesProps> = ({
  connected,
  statusMsg,
  lastSynced,
  mockMode,
  onConnect,
  onDisconnect,
  onToggleMock
}) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Devices</h1>
        <p>Manage your connected smart water bottles and sensors</p>
      </div>

      {/* Connection Status */}
      <div className="card">
        <h3>Connection Status</h3>
        <div className="devices-grid">
          <div className={`device-card ${connected ? 'connected' : ''}`}>
            <div className="device-icon">
              <span>{connected ? '🔗' : '📱'}</span>
            </div>
            <h4>Smart Water Bottle</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Bluetooth-enabled hydration tracking device
            </p>
            <div className={`device-status ${connected ? 'connected' : 'disconnected'}`}>
              {connected ? 'Connected' : 'Disconnected'}
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <p><strong>Status:</strong> {statusMsg}</p>
              <p><strong>Last sync:</strong> {lastSynced ? formatTime(lastSynced) : 'Never'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Device Actions */}
      <div className="card">
        <h3>Device Actions</h3>
        <div className="quick-actions">
          <button 
            className="action-btn"
            onClick={connected ? onDisconnect : onConnect}
            disabled={mockMode}
          >
            <div className="action-icon">
              <span>{connected ? '🔌' : '📶'}</span>
            </div>
            <div className="action-content">
              <div className="action-label">
                {connected ? 'Disconnect Device' : 'Connect Device'}
              </div>
              <div className="action-description">
                {connected 
                  ? 'Disconnect from your smart water bottle' 
                  : 'Connect to your smart water bottle via Bluetooth'
                }
              </div>
            </div>
          </button>
          
          <button className="action-btn" onClick={onToggleMock}>
            <div className="action-icon">
              <span>🎮</span>
            </div>
            <div className="action-content">
              <div className="action-label">
                {mockMode ? 'Disable Demo Mode' : 'Enable Demo Mode'}
              </div>
              <div className="action-description">
                {mockMode 
                  ? 'Stop generating mock hydration data' 
                  : 'Test the app with simulated data'
                }
              </div>
            </div>
          </button>
          
          <button className="action-btn">
            <div className="action-icon">
              <span>🔄</span>
            </div>
            <div className="action-content">
              <div className="action-label">Sync Data</div>
              <div className="action-description">Manually sync with connected device</div>
            </div>
          </button>
        </div>
      </div>

      {/* Device Requirements */}
      <div className="card">
        <h3>Device Requirements</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>🌐</span>
              <strong>Web Bluetooth Support</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Chrome, Edge, or other Chromium-based browsers are required for Bluetooth connectivity.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>🔒</span>
              <strong>HTTPS Required</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Bluetooth features require a secure connection (HTTPS) for privacy and security.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>📱</span>
              <strong>Compatible Devices</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Works with smart water bottles that support the Hydration Hero protocol.
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="card">
        <h3>Troubleshooting</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>❓</span>
              <strong>Can't Connect?</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Make sure your device is in pairing mode and Bluetooth is enabled on your computer.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>🔄</span>
              <strong>Connection Drops?</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Try moving closer to your device and avoid interference from other Bluetooth devices.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: 'var(--surface-glass)', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>🎮</span>
              <strong>Testing the App?</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Use Demo Mode to test all features without a physical device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devices;
