import React from 'react';
import HabitRow from './HabitRow.jsx';
import { formatDateKey, isToday, formatDayLabel, formatDayNumber } from '../utils/dateUtils.js';

export default function HabitGrid({ habits, weekDays, completions, onToggle, onRename, onDelete, isCurrentWeek, notes, onOpenNoteModal }) {
  return (
    <div className="habit-grid">
      {/* Grid Header */}
      <div className="grid-header">
        <div className="header-habit">Habit</div>
        {weekDays.map((day) => {
          const today = isToday(day);
          return (
            <div 
              key={formatDateKey(day)} 
              className={`header-day ${today ? 'today' : ''}`}
            >
              <span className="day-label">{formatDayLabel(day, 'short')}</span>
              <span className="day-number">{formatDayNumber(day)}</span>
              {today && <span className="today-tag">Today</span>}
            </div>
          );
        })}
      </div>

      {/* Habit Rows */}
      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          weekDays={weekDays}
          completions={completions}
          onToggle={onToggle}
          onRename={onRename}
          onDelete={onDelete}
          isCurrentWeek={isCurrentWeek}
          notes={notes?.[habit.id] || {}}
          onOpenNoteModal={onOpenNoteModal}
        />
      ))}
    </div>
  );
}