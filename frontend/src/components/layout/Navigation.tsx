import React from 'react';
import type { Page } from '../../App';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: '📊' },
    { id: 'history' as Page, label: 'History', icon: '📈' },
    { id: 'profile' as Page, label: 'Profile', icon: '👤' },
    { id: 'devices' as Page, label: 'Devices', icon: '📱' },
    { id: 'settings' as Page, label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
          >
            <div className="nav-icon-container">
              <span>{item.icon}</span>
              {currentPage === item.id && <div className="nav-active-indicator" />}
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
