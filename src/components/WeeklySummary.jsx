import React from 'react';
import { formatDateKey } from '../utils/dateUtils.js';

export default function WeeklySummary({ habits = [], completions = {}, weekDays = [] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate statistics for each habit
  const habitStats = habits.map(habit => {
    let eligibleDays = 0;
    let completedDays = 0;

    weekDays.forEach(day => {
      const d = new Date(day);
      d.setHours(0, 0, 0, 0);
      
      // Only count days up to today
      if (d.getTime() <= today.getTime()) {
        eligibleDays++;
        const dateKey = formatDateKey(d);
        if (completions[habit.id]?.[dateKey] === true) {
          completedDays++;
        }
      }
    });

    const rate = eligibleDays > 0 ? Math.round((completedDays / eligibleDays) * 100) : 0;
    const missed = eligibleDays - completedDays;

    return {
      habit,
      eligibleDays,
      completedDays,
      missedDays: missed,
      rate
    };
  });

  // Calculate overall stats
  let totalEligible = 0;
  let totalCompleted = 0;
  habitStats.forEach(stat => {
    totalEligible += stat.eligibleDays;
    totalCompleted += stat.completedDays;
  });

  const overallPct = totalEligible > 0 ? Math.round((totalCompleted / totalEligible) * 100) : 0;

  // Grade calculation
  let grade = 'F';
  if (overallPct >= 90) grade = 'A';
  else if (overallPct >= 80) grade = 'B';
  else if (overallPct >= 70) grade = 'C';
  else if (overallPct >= 60) grade = 'D';

  // Find star performer (highest rate > 0)
  let bestHabit = null;
  let maxRate = 0;
  habitStats.forEach(stat => {
    if (stat.rate > maxRate) {
      maxRate = stat.rate;
      bestHabit = stat;
    }
  });

  // Find needs attention (lowest rate < 100)
  let worstHabit = null;
  let minRate = 100;
  habitStats.forEach(stat => {
    // If all are 100%, worstHabit remains null
    if (stat.rate < minRate && stat.eligibleDays > 0) {
      minRate = stat.rate;
      worstHabit = stat;
    }
  });

  if (totalEligible === 0) {
    return (
      <div className="weekly-summary-panel">
        <div className="summary-grade-section" style={{ gridColumn: '1 / -1' }}>
          <div className="summary-grade-title">Weekly Summary</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No days have elapsed in this week yet. Keep checking in as the week progresses!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="weekly-summary-panel">
      {/* Grade Section */}
      <div className="summary-grade-section">
        <span className="summary-grade-title">Weekly Grade</span>
        <span className="summary-grade-letter">{grade}</span>
        <span className="summary-grade-pct">{overallPct}% Completion</span>
      </div>

      {/* Stats and Highlights Section */}
      <div className="summary-stats-section">
        <div className="summary-highlights">
          {/* Star Performer */}
          <div className="highlight-box best">
            <div className="highlight-label">Star Performer</div>
            <div className="highlight-val">
              {bestHabit ? bestHabit.habit.name : 'None yet'}
            </div>
            <div className="highlight-sub">
              {bestHabit ? `${bestHabit.rate}% completion` : 'Complete a habit to set'}
            </div>
          </div>

          {/* Needs Attention */}
          <div className="highlight-box needs-attention">
            <div className="highlight-label">Needs Attention</div>
            <div className="highlight-val">
              {worstHabit ? worstHabit.habit.name : 'None'}
            </div>
            <div className="highlight-sub">
              {worstHabit ? `${worstHabit.rate}% completion` : 'All habits on track! 🙌'}
            </div>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="summary-breakdown-list">
          {habitStats.map(stat => (
            <div key={stat.habit.id} className="summary-breakdown-item">
              <div className="summary-item-name-col">
                <span className={`cat-dot ${stat.habit.category || 'general'}`} />
                <span className="summary-item-name" title={stat.habit.name}>
                  {stat.habit.name}
                </span>
              </div>
              <div className="summary-item-stats">
                <span>{stat.completedDays}/{stat.eligibleDays} days</span>
                <span className="summary-item-pct">{stat.rate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
