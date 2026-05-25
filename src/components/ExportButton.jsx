import React from 'react';

export default function ExportButton({ habits = [], completions = {}, notes = {} }) {
  const handleExport = () => {
    // CSV headers
    const headers = ['Habit Name', 'Category', 'Date', 'Status', 'Note'];
    const rows = [headers];

    habits.forEach(habit => {
      const habitCompletions = completions[habit.id] || {};
      const habitNotes = notes[habit.id] || {};
      
      // Get union of all dates with activity (completion or note)
      const allDates = new Set([
        ...Object.keys(habitCompletions),
        ...Object.keys(habitNotes)
      ]);

      if (allDates.size === 0) {
        // Escape quotes
        const escapedName = habit.name.replace(/"/g, '""');
        rows.push([
          `"${escapedName}"`,
          habit.category || 'general',
          'N/A',
          'No activity',
          '""'
        ]);
      } else {
        // Sort dates chronologically
        const sortedDates = Array.from(allDates).sort();
        sortedDates.forEach(date => {
          const isCompleted = habitCompletions[date] === true;
          const noteText = habitNotes[date] || '';
          
          // Escape quotes in CSV fields
          const escapedName = habit.name.replace(/"/g, '""');
          const escapedNote = noteText.replace(/"/g, '""');
          
          rows.push([
            `"${escapedName}"`,
            habit.category || 'general',
            date,
            isCompleted ? 'Completed' : 'Incomplete',
            `"${escapedNote}"`
          ]);
        });
      }
    });

    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nizam_habits_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport} className="export-btn" title="Export data to CSV">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span>Export CSV</span>
    </button>
  );
}
