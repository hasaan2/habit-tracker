import React from 'react';
import ExportButton from './ExportButton.jsx';

export default function Header({ habits, completions, notes, showSettings, onToggleSettings }) {
  return (
    <header className="header">
      <div className="header-actions">
        <button 
          onClick={onToggleSettings}
          className={`settings-toggle-btn ${showSettings ? 'active' : ''}`}
          title="Reminder Settings"
          aria-label="Toggle reminder settings"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <ExportButton habits={habits} completions={completions} notes={notes} />
      </div>
      <div className="header-brand">
        <div className="header-logo" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gold-metal" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#8a6f27" />
                <stop offset="20%" stop-color="#e8c86b" />
                <stop offset="40%" stop-color="#fff6d1" />
                <stop offset="60%" stop-color="#d1ab3f" />
                <stop offset="80%" stop-color="#8a6f27" />
                <stop offset="100%" stop-color="#ebd078" />
              </linearGradient>
              <linearGradient id="silver-metal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E2E8F0" />
                <stop offset="25%" stop-color="#FFFFFF" />
                <stop offset="50%" stop-color="#94A3B8" />
                <stop offset="75%" stop-color="#475569" />
                <stop offset="100%" stop-color="#cbd5e1" />
              </linearGradient>
              <linearGradient id="green-metal" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#064e3b" />
                <stop offset="30%" stop-color="#10b981" />
                <stop offset="70%" stop-color="#34d399" />
                <stop offset="100%" stop-color="#6ee7b7" />
              </linearGradient>
            </defs>

            {/* Gold Ring Shadow */}
            <path d="M 81 32 A 36 36 0 1 1 68 19" stroke="#000000" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.4" transform="translate(1, 2)" />

            {/* Gold Ring */}
            <path d="M 81 32 A 36 36 0 1 1 68 19" stroke="url(#gold-metal)" stroke-width="9" stroke-linecap="round" fill="none" />
            <path d="M 81 32 A 36 36 0 1 1 68 19" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.25" />

            {/* Silver Arrow Shadow */}
            <path d="M 30 70 L 45 55 L 53 55 L 63 45" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.3" transform="translate(1, 2)" />
            <path d="M 55 45 L 70 38 L 63 53 L 59 49 Z" fill="#000000" opacity="0.3" transform="translate(1, 2)" />

            {/* Silver Arrow Shaft */}
            <path d="M 30 70 L 45 55 L 53 55 L 63 45" stroke="url(#silver-metal)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            
            {/* Silver Arrow Head */}
            <path d="M 55 45 L 70 38 L 63 53 L 59 49 Z" fill="url(#silver-metal)" />

            {/* Silver Arrow Highlights */}
            <path d="M 30 70 L 45 55 L 53 55 L 63 45" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.4" />

            {/* Green Checkmark Shadow */}
            <path d="M 64 25 L 73 34 L 86 17" stroke="#000000" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.3" transform="translate(1, 2)" />

            {/* Green Checkmark */}
            <path d="M 64 25 L 73 34 L 86 17" stroke="url(#green-metal)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <path d="M 64 25 L 73 34 L 86 17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.5" />
          </svg>
        </div>
        <h1>Nizam</h1>
      </div>
      <p className="header-subtitle">Build discipline, one day at a time</p>
      <div className="header-divider" />
    </header>
  );
}