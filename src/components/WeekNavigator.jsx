import React from 'react';
import { formatWeekRange, isSameWeek } from '../utils/dateUtils.js';

export default function WeekNavigator({ currentWeekStart, onPrevious, onNext, onToday, showSummary, onToggleSummary }) {
  const isCurrentWeek = isSameWeek(currentWeekStart, new Date());
  const weekRange = formatWeekRange(currentWeekStart);

  return (
    <div className="week-nav">
      <div className="nav-buttons">
        <button 
          onClick={onPrevious}
          className="nav-btn"
          aria-label="Previous week"
        >
          ← Prev
        </button>
        <button 
          onClick={onToday}
          className="today-btn"
          disabled={isCurrentWeek}
          aria-label="Go to current week"
        >
          This Week
        </button>
        <button 
          onClick={onNext}
          className="nav-btn"
          aria-label="Next week"
        >
          Next →
        </button>
      </div>
      <div className="week-right-container">
        <span className="week-range">{weekRange}</span>
        <button 
          onClick={onToggleSummary}
          className={`summary-toggle-btn ${showSummary ? 'active' : ''}`}
          aria-label="Toggle weekly summary"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Summary</span>
        </button>
      </div>
    </div>
  );
}