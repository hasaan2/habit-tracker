# Nizam — Premium Habit Tracker

Nizam is a high-end, matte-black and gold habit tracking web application built to help users build discipline, one day at a time.

👉 **[Live Application Link](https://habit-tracker.hasaanahmedrana1.workers.dev/)** (Hosted via Cloudflare)

---

## Quick Start

```bash
git clone https://github.com/hasaanahmedrana1/habit-tracker.git
cd habit-tracker
npm install
npm run dev
```

Then open **`http://localhost:5173`** in your browser.

---

## Key Features

- **Matte Black & Gold Glassmorphic Theme**: Designed with a deep, clear black background (`#080808`), gold-infused translucent borders, and glowing accents to prevent eye strain.
- **V2 3D Logo**: Glossy 3D-styled gold, silver, and green logo designed to capture attention.
- **Habit Categorization**: Assign habits to categories (General, Health, Study, Spiritual, Productivity) and filter the entire dashboard by category.
- **Daily Motivational Quotes**: A dedicated daily quote banner that updates automatically at midnight or can be cycled manually.
- **Context-Aware Smart Reminders**: Sliding toast banners and native HTML5 desktop notifications:
  - *Evening Nudge* (after 8:00 PM) for pending habits.
  - *Streak Warning* (after 10:00 PM) to protect current streaks.
  - A collapsible **Reminders Settings** panel to manage permissions.
- **Progress Notes**: Double-click or right-click any cell to add/edit notes. Cells display a glowing gold indicator, and notes show in a tooltip on hover.
- **Weekly Performance Summary**: Toggles a collapsible performance report card displaying a letter grade (A/B/C/D/F), your "Star Performer", and "Needs Attention" habits.
- **CSV Data Exporter**: One-click download of all habit records, categories, and progress notes.
- **Dynamic Stats Bar**: Real-time trackers for total habits, weekly completion percentage, best streak, and total check-ins.
- **Streak Tracker**: Real-time consecutive-day streak calculation with status badges.
- **Responsive Layout**: Designed to work seamlessly from 360px mobile view (stacked form elements) to 1440px desktop.

---

## Tech Stack

- React 18 + Vite 6
- Plain CSS with custom CSS variables (no Tailwind/Bootstrap/UI libraries)
- Plus Jakarta Sans + JetBrains Mono typography
- localStorage for client-side persistence