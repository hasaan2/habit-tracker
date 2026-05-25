import React, { useState, useRef, useEffect, useMemo } from 'react';
import CompletionCell from './CompletionCell.jsx';
import { calculateStreak } from '../utils/streak.js';
import { formatDateKey } from '../utils/dateUtils.js';

export default function HabitRow({ habit, weekDays, completions, onToggle, onRename, onDelete, isCurrentWeek, notes, onOpenNoteModal }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(habit.name);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [streakAnimating, setStreakAnimating] = useState(false);
  const inputRef = useRef(null);

  const streak = calculateStreak(habit.id, completions);
  const prevStreakRef = useRef(streak);

  // Calculate weekly progress
  const weeklyProgress = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let eligible = 0;
    let done = 0;
    weekDays.forEach((day) => {
      const d = new Date(day);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() <= today.getTime()) {
        eligible++;
        const dateKey = formatDateKey(d);
        if (completions[habit.id]?.[dateKey] === true) {
          done++;
        }
      }
    });
    return eligible > 0 ? Math.round((done / eligible) * 100) : 0;
  }, [habit.id, completions, weekDays]);

  // Animate streak when it changes
  useEffect(() => {
    if (streak !== prevStreakRef.current) {
      setStreakAnimating(true);
      const timer = setTimeout(() => setStreakAnimating(false), 350);
      prevStreakRef.current = streak;
      return () => clearTimeout(timer);
    }
  }, [streak]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed.length <= 50) {
      onRename(habit.id, trimmed);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(habit.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const handleDeleteConfirm = () => {
    onDelete(habit.id);
  };

  const streakClass = streak >= 7 ? 'streak-badge fire' : 'streak-badge';
  const streakIcon = streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '';

  return (
    <div className="habit-row animate-fade-in">
      {/* Habit name + streak column */}
      <div className="habit-info">
        {isEditing ? (
          <div className="edit-mode">
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="edit-input"
              maxLength={50}
              aria-label="Edit habit name"
            />
            <div className="edit-actions">
              <button onClick={handleSave} className="edit-btn save" aria-label="Save habit name">Save</button>
              <button onClick={handleCancel} className="edit-btn cancel" aria-label="Cancel editing">Cancel</button>
            </div>
          </div>
        ) : isConfirmingDelete ? (
          <div className="delete-confirm">
            <span className="delete-text">Delete this habit?</span>
            <div className="delete-actions">
              <button onClick={handleDeleteConfirm} className="edit-btn confirm-delete" aria-label="Confirm delete habit">Yes</button>
              <button onClick={() => setIsConfirmingDelete(false)} className="edit-btn cancel" aria-label="Cancel delete">No</button>
            </div>
          </div>
        ) : (
          <>
            <div className="habit-name-row">
              <div className="habit-name-wrapper">
                <span className={`cat-dot ${habit.category || 'general'}`} title={`Category: ${habit.category || 'general'}`} />
                <span className="habit-name" title={habit.name}>{habit.name}</span>
              </div>
              <div className="row-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="icon-btn"
                  aria-label={`Edit ${habit.name}`}
                  title="Edit habit"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setIsConfirmingDelete(true)}
                  className="icon-btn delete"
                  aria-label={`Delete ${habit.name}`}
                  title="Delete habit"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="habit-meta">
              <span
                className={`${streakClass} ${streakAnimating ? 'animate-streak' : ''}`}
                aria-label={`${streak} day streak`}
              >
                {streakIcon && <span>{streakIcon}</span>}
                {streak === 0 ? 'No streak' : `${streak} day${streak !== 1 ? 's' : ''}`}
              </span>
              <span className="weekly-pct">{weeklyProgress}%</span>
            </div>
          </>
        )}
      </div>

      {/* Day cells */}
      {weekDays.map((day) => (
        <CompletionCell
          key={formatDateKey(day)}
          habit={habit}
          date={day}
          completions={completions}
          onToggle={onToggle}
          notes={completions[habit.id] ? (completions.notes || {}) : {}} /* fallback if needed, but we will pass habit specific notes */
          habitNotes={notes}
          onOpenNoteModal={onOpenNoteModal}
        />
      ))}

      {/* Progress bar */}
      {!isEditing && !isConfirmingDelete && (
        <div className="row-progress-track">
          <div className="row-progress-fill" style={{ width: `${weeklyProgress}%` }} />
        </div>
      )}
    </div>
  );
}