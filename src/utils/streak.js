import { formatDateKey, addDays } from './dateUtils.js';

/**
 * Calculate the CURRENT streak for a habit — always from today, regardless
 * of which week is being viewed.
 *
 * Algorithm:
 * 1. Start from today. If today is checked, include it and count backwards.
 * 2. If today is NOT checked, start counting from yesterday.
 * 3. Count consecutive completed days backwards with no gaps.
 *
 * This gives the user their true ongoing streak at all times.
 * The `createdAt` guard has been removed — if a user retroactively marks
 * days before the habit was created, those completions count.
 */
export function calculateStreak(habitId, completions) {
  const habitCompletions = completions[habitId];
  if (!habitCompletions) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatDateKey(today);
  const todayChecked = habitCompletions[todayKey] === true;

  // Start from today if checked, otherwise from yesterday
  let currentDate = todayChecked ? new Date(today) : addDays(today, -1);
  let streak = 0;

  // Safety limit: don't loop infinitely (max 365 days back)
  const maxDays = 365;

  for (let i = 0; i < maxDays; i++) {
    const dateKey = formatDateKey(currentDate);

    if (habitCompletions[dateKey] === true) {
      streak++;
      currentDate = addDays(currentDate, -1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate the best (longest) streak ever achieved for a habit.
 */
export function calculateBestStreak(habitId, completions) {
  const habitCompletions = completions[habitId];
  if (!habitCompletions) return 0;

  const dates = Object.keys(habitCompletions)
    .filter(k => habitCompletions[k] === true)
    .sort();

  if (dates.length === 0) return 0;

  let best = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + 'T00:00:00');
    const curr = new Date(dates[i] + 'T00:00:00');
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
}