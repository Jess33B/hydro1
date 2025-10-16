import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { connectToHydrationBottle, disconnectFromHydrationBottle, isBleSupported, startNotifications } from './ble';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Devices from './pages/Devices';
import './styles.css';

export type Page = 'dashboard' | 'history' | 'profile' | 'settings' | 'devices';
export type ActivityLevel = 'low' | 'moderate' | 'high';
export type HistoryPoint = { timestamp: number; intakeMl: number };

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

function computeDailyGoalMl(weightKg: number): number {
  if (!weightKg || weightKg <= 0) return 0;
  return Math.round(weightKg * 35);
}

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // State from original app
  const [weightKg, setWeightKg] = useState<number>(70);
  const [age, setAge] = useState<number | ''>('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
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

  const pages = {
    dashboard: (
      <Dashboard 
        intakeMl={intakeMl}
        dailyGoalMl={dailyGoalMl}
        predictionText={predictionText}
        history={history}
        dailyBuckets={dailyBuckets}
        connected={connected}
        statusMsg={statusMsg}
        lastSynced={lastSynced}
        mockMode={mockMode}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onToggleMock={() => setMockMode(!mockMode)}
      />
    ),
    history: <History history={history} dailyBuckets={dailyBuckets} />,
    profile: (
      <Profile 
        weightKg={weightKg}
        age={age}
        activity={activity}
        darkMode={darkMode}
        onWeightChange={setWeightKg}
        onAgeChange={setAge}
        onActivityChange={setActivity}
        onThemeChange={setDarkMode}
      />
    ),
    settings: <Settings />,
    devices: (
      <Devices 
        connected={connected}
        statusMsg={statusMsg}
        lastSynced={lastSynced}
        mockMode={mockMode}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onToggleMock={() => setMockMode(!mockMode)}
      />
    ),
  };

  return (
    <div className="app">
      <div className="app-background"></div>
      <Header />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {pages[currentPage]}
          </motion.div>
        </AnimatePresence>
      </main>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};