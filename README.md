# Nizam — Habit Tracker

A premium, dark-themed habit tracking web app built with React + Vite.

## Quick Start

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Features

- **Add habits**: Type a name and press Enter or click Add Habit
- **Rename habits**: Click the edit icon next to any habit name
- **Delete habits**: Click the trash icon with inline confirmation
- **Weekly grid**: 7-day view with Monday-start weeks (ISO 8601)
- **Toggle completion**: Click any cell to check/uncheck
- **Today highlight**: Golden amber glow on today's column
- **Streak counter**: Real-time consecutive-day streak with fire/lightning icons
- **Weekly progress bar**: Per-habit progress visualization
- **Stats dashboard**: Active habits, weekly rate, best streak, total check-ins
- **Week navigation**: Previous, Next, and "This Week" buttons
- **Persistence**: All data saved to localStorage
- **Empty state**: Helpful suggestions with emoji icons when no habits exist
- **Responsive**: Works from 360px mobile to 1440px desktop
- **Accessible**: Keyboard navigation, focus states, ARIA labels
- **Dark theme**: Premium dark UI with gradient accents and glow effects

## Tech Stack

- React 18 + Vite
- Plain CSS with CSS custom properties (no UI library)
- Plus Jakarta Sans + JetBrains Mono typography
- localStorage for persistence
- No external dependencies beyond React