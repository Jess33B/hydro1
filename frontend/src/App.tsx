import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { connectToHydrationBottle, disconnectFromHydrationBottle, isBleSupported, startNotifications } from './ble';

type ActivityLevel = 'low' | 'moderate' | 'high';

type HistoryPoint = { timestamp: number; intakeMl: number };

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

function computeDailyGoalMl(weightKg: number): number {
  if (!weightKg || weightKg <= 0) return 0;
  return Math.round(weightKg * 35);
}

export const App: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(70);
  const [age, setAge] = useState<number | ''>('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [intakeMl, setIntakeMl] = useState<number>(0);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('Disconnected');

  const [mockMode, setMockMode] = useState<boolean>(false);
  const mockTimerRef = useRef<number | null>(null);

  const dailyGoalMl = useMemo(() => computeDailyGoalMl(weightKg), [weightKg]);
  const deltaToGoal = useMemo(() => intakeMl - dailyGoalMl, [intakeMl, dailyGoalMl]);
  const predictionText = useMemo(() => {
    if (dailyGoalMl <= 0) return 'Enter your weight to set a goal.';
    if (deltaToGoal >= 0) return `You are ahead by ${deltaToGoal} ml.`;
    return `You are behind by ${Math.abs(deltaToGoal)} ml.`;
  }, [deltaToGoal, dailyGoalMl]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  // Mock mode for quick demo/testing
  useEffect(() => {
    if (!mockMode) {
      if (mockTimerRef.current) {
        window.clearInterval(mockTimerRef.current);
        mockTimerRef.current = null;
      }
      return;
    }
    setStatusMsg('Mocking intake...');
    mockTimerRef.current = window.setInterval(() => {
      const delta = Math.floor(15 + Math.random() * 45);
      setIntakeMl(prev => {
        const next = prev + delta;
        setHistory(h => [...h, { timestamp: Date.now(), intakeMl: next }]);
        setLastSynced(Date.now());
        return next;
      });
    }, 12000);
    return () => {
      if (mockTimerRef.current) window.clearInterval(mockTimerRef.current);
      mockTimerRef.current = null;
    };
  }, [mockMode]);

  const handleConnect = useCallback(async () => {
    if (!isBleSupported()) {
      setStatusMsg('Web Bluetooth not supported in this browser. Use Chrome/Edge on desktop.');
      return;
    }
    try {
      setStatusMsg('Requesting device...');
      const { device, characteristic } = await connectToHydrationBottle();
      setConnected(true);
      setStatusMsg('Connected. Subscribing to notifications...');
      await startNotifications(characteristic, (value) => {
        // Value is a DataView containing little-endian uint32 cumulative mL
        const ml = value.getUint32(0, true);
        setIntakeMl(ml);
        setHistory(h => [...h, { timestamp: Date.now(), intakeMl: ml }]);
        setLastSynced(Date.now());
      }, () => {
        setConnected(false);
        setStatusMsg('Disconnected');
      });
      setStatusMsg('Receiving updates...');
      device.addEventListener('gattserverdisconnected', () => {
        setConnected(false);
        setStatusMsg('Disconnected');
      });
    } catch (err: any) {
      setStatusMsg(err?.message || 'Connection error');
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnectFromHydrationBottle();
    } catch {}
    setConnected(false);
    setStatusMsg('Disconnected');
  }, []);

  // Simple weekly/monthly grouping (mocked by splitting by day)
  const dailyBuckets = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const p of history) {
      const d = new Date(p.timestamp);
      const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      byDay.set(key, Math.max(byDay.get(key) || 0, p.intakeMl));
    }
    return Array.from(byDay.entries()).map(([k, v]) => ({ day: k, ml: v }));
  }, [history]);

  return (
    <div className="app">
      <header className="header">
        <h1>Hydration Hero</h1>
        <div className="spacer" />
        <button className="btn" onClick={() => setDarkMode(v => !v)}>{darkMode ? 'Light' : 'Dark'} Mode</button>
      </header>

      <section className="card">
        <h2>User Profile</h2>
        <div className="form-grid">
          <label>
            Weight (kg)
            <input type="number" min={1} value={weightKg}
                   onChange={e => setWeightKg(parseFloat(e.target.value) || 0)} />
          </label>
          <label>
            Age (optional)
            <input type="number" min={0} value={age}
                   onChange={e => setAge(e.target.value === '' ? '' : parseInt(e.target.value))} />
          </label>
          <label>
            Activity
            <select value={activity} onChange={e => setActivity(e.target.value as ActivityLevel)}>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <div className="goal">Daily goal: <strong>{dailyGoalMl} ml</strong></div>
      </section>

      <section className="grid-2">
        <div className="card">
          <h2>Dashboard</h2>
          <div className="metrics">
            <div>
              <div className="metric-label">Total Intake</div>
              <div className="metric-value">{intakeMl} ml</div>
            </div>
            <div>
              <div className="metric-label">Goal</div>
              <div className="metric-value">{dailyGoalMl} ml</div>
            </div>
          </div>
          <div className="progress">
            <div className="bar">
              <div className="fill" style={{ width: `${Math.min(100, dailyGoalMl ? Math.round((intakeMl / dailyGoalMl) * 100) : 0)}%` }} />
            </div>
            <div className="progress-label">{dailyGoalMl ? Math.min(100, Math.round((intakeMl / dailyGoalMl) * 100)) : 0}%</div>
          </div>
          <div className="prediction">{predictionText}</div>
        </div>

        <div className="card">
          <h2>Device</h2>
          <div className="device-row">
            <button className="btn" onClick={connected ? handleDisconnect : handleConnect}>
              {connected ? 'Disconnect Bottle' : 'Connect Bottle'}
            </button>
            <label className="switch">
              <input type="checkbox" checked={mockMode} onChange={e => setMockMode(e.target.checked)} />
              <span>Mock mode</span>
            </label>
          </div>
          <div className={`status ${connected ? 'ok' : 'warn'}`}>
            <strong>Status:</strong> {statusMsg}
          </div>
          <div className="status"><strong>Last synced:</strong> {lastSynced ? formatTime(lastSynced) : '—'}</div>
        </div>
      </section>

      <section className="card">
        <h2>Real-time Intake</h2>
        <div className="chart">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={history} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTime} interval="preserveStartEnd" />
              <YAxis dataKey="intakeMl" />
              <Tooltip labelFormatter={(l: any) => formatTime(l as number)} formatter={(v: any) => [`${v} ml`, 'Intake']} />
              <Legend />
              <Line isAnimationActive={false} type="monotone" dataKey="intakeMl" stroke="#4f46e5" dot={false} name="Intake (ml)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <h2>Daily Trends</h2>
        <div className="chart">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyBuckets} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(v: any) => [`${v} ml`, 'Total']} />
              <Bar dataKey="ml" fill="#22c55e" name="Daily total (ml)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <footer className="footer">Web Bluetooth requires Chrome/Edge on desktop. Use HTTPS or localhost.</footer>
    </div>
  );
};


