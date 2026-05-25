import React from 'react';
import { calculateBestStreak } from '../utils/streak.js';
import { formatDateKey } from '../utils/dateUtils.js';

export default function StatsBar({ habits, completions, weekDays }) {
  const totalHabits = habits.length;

  let totalCells = 0;
  let completedCells = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  weekDays.forEach((day) => {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() <= today.getTime()) {
      habits.forEach((habit) => {
        totalCells++;
        const dateKey = formatDateKey(d);
        if (completions[habit.id]?.[dateKey] === true) {
          completedCells++;
        }
      });
    }
  });

  const weeklyRate = totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0;

  let bestStreak = 0;
  habits.forEach((habit) => {
    const best = calculateBestStreak(habit.id, completions);
    bestStreak = Math.max(bestStreak, best);
  });

  let totalCompletions = 0;
  Object.values(completions).forEach((hc) => {
    totalCompletions += Object.values(hc).filter(v => v === true).length;
  });

  return (
    <div className="stats-bar animate-fade-in">
      <div className="stat-card">
        <div className="stat-value accent">{totalHabits}</div>
        <div className="stat-label">Habits</div>
      </div>
      <div className="stat-card">
        <div className="stat-value success">{weeklyRate}%</div>
        <div className="stat-label">This Week</div>
      </div>
      <div className="stat-card">
        <div className="stat-value fire">{bestStreak}d</div>
        <div className="stat-label">Best Streak</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{totalCompletions}</div>
        <div className="stat-label">Check-ins</div>
      </div>
    </div>
  );
}
