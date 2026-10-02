import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm rounded-pill d-flex align-items-center justify-content-center p-2 border"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          width: '38px',
          height: '38px'
        }}
        type="button"
        id="themeDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon size={18} className="text-warning" />
        ) : (
          <Sun size={18} className="text-warning" />
        )}
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end shadow-sm mt-2"
        aria-labelledby="themeDropdown"
        style={{
          minWidth: '150px',
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)'
        }}
      >
        <li>
          <button
            className={`dropdown-item d-flex align-items-center justify-content-between py-2 ${
              theme === 'light' ? 'fw-bold text-primary' : ''
            }`}
            onClick={() => setTheme('light')}
          >
            <span className="d-flex align-items-center gap-2">
              <Sun size={16} /> Light
            </span>
            {theme === 'light' && <Check size={16} />}
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item d-flex align-items-center justify-content-between py-2 ${
              theme === 'dark' ? 'fw-bold text-primary' : ''
            }`}
            onClick={() => setTheme('dark')}
          >
            <span className="d-flex align-items-center gap-2">
              <Moon size={16} /> Dark
            </span>
            {theme === 'dark' && <Check size={16} />}
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item d-flex align-items-center justify-content-between py-2 ${
              theme === 'system' ? 'fw-bold text-primary' : ''
            }`}
            onClick={() => setTheme('system')}
          >
            <span className="d-flex align-items-center gap-2">
              <Monitor size={16} /> System
            </span>
            {theme === 'system' && <Check size={16} />}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ThemeToggle;
