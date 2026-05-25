import React from 'react';

const SUGGESTIONS = [
  { name: 'Exercise', icon: '💪' },
  { name: 'Read 30min', icon: '📖' },
  { name: 'Drink Water', icon: '💧' },
  { name: 'Meditate', icon: '🧘' },
  { name: 'No Junk Food', icon: '🥗' },
];

export default function EmptyState({ onAddSuggestion }) {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-content">
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
        </div>
        <h2 className="empty-title">Your journey starts here</h2>
        <p className="empty-desc">
          Nizam helps you build discipline through consistency. Add your first habit and start tracking — even one small action daily creates unstoppable momentum.
        </p>
        <div className="suggestions">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.name}
              onClick={() => onAddSuggestion(suggestion.name)}
              className="suggestion-btn"
              aria-label={`Add suggested habit: ${suggestion.name}`}
            >
              <span>{suggestion.icon}</span>
              {suggestion.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}