import React from 'react';
import { formatDateKey, isToday, isFutureDate } from '../utils/dateUtils.js';

export default function CompletionCell({ habit, date, completions, onToggle, habitNotes = {}, onOpenNoteModal }) {
  const dateKey = formatDateKey(date);
  const completed = completions[habit.id]?.[dateKey] === true;
  const isFuture = isFutureDate(date);
  const isTodayCol = isToday(date);
  const noteText = habitNotes[dateKey] || '';

  const handleClick = () => {
    if (!isFuture) {
      onToggle(habit.id, dateKey);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isFuture) {
        onToggle(habit.id, dateKey);
      }
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!isFuture && onOpenNoteModal) {
      onOpenNoteModal(habit.id, habit.name, dateKey, noteText);
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    if (!isFuture && onOpenNoteModal) {
      onOpenNoteModal(habit.id, habit.name, dateKey, noteText);
    }
  };

  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const ariaLabel = completed
    ? `Mark ${habit.name} as incomplete for ${dayName}, ${monthDay}. Double-click or right-click to add note.`
    : `Mark ${habit.name} as complete for ${dayName}, ${monthDay}. Double-click or right-click to add note.`;

  const classNames = ['cell-btn'];
  if (isTodayCol) classNames.push('today');
  if (completed) classNames.push('checked');
  if (isFuture) classNames.push('future');

  return (
    <div className="completion-cell" onContextMenu={handleContextMenu} onDoubleClick={handleDoubleClick}>
      <div
        role="button"
        tabIndex={isFuture ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-pressed={completed}
        aria-disabled={isFuture}
        className={classNames.join(' ')}
      >
        {completed && (
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="checkmark animate-checkmark"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {noteText && <div className="note-dot" />}
      </div>
      {noteText && (
        <div className="cell-tooltip" role="tooltip">
          {noteText}
        </div>
      )}
    </div>
  );
}