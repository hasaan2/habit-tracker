# Nizam - Premium Habit Tracker

Nizam is a premium, matte-black and gold habit tracking dashboard built to help users build discipline, one day at a time.

---

## 1. Live Deployment

The application is deployed and live for immediate access:

👉 **[Live App Link](https://habit-tracker.hasaanahmedrana1.workers.dev/)** (Deployed via Cloudflare Pages)

---

## 2. Running Locally

If you wish to clone and run the application locally on your machine, follow these steps:

### Step 1: Clone the Repository
Clone the repository using Git and navigate into the project directory:
```bash
git clone https://github.com/hasaanahmedrana1/habit-tracker.git
cd habit-tracker
```

### Step 2: Install Dependencies
Install all the required npm packages (requires Node.js 18+):
```bash
npm install
```

### Step 3: Start the Development Server
Launch the local Vite server:
```bash
npm run dev
```

### Step 4: Open in Browser
Once the server is running, open your browser and go to the local host address shown in your terminal (typically **`http://localhost:5173`**).

---

## 3. Technology Stack & Design

- **React & Vite**: Built for a fast development loop and a highly responsive single-page experience.
- **Vanilla CSS**: Used custom CSS variables to build a polished, high-performance, dark glassmorphism design system from scratch.
- **Matte Black & Gold Theme**: A clean, high-contrast dark theme designed to reduce eye strain. We used pure deep blacks (`#080808`), gold-infused translucent borders, and bright champagne gold highlights to give the app a luxury, enterprise feel.

---

## 4. Key Enhancements & Features

Here are the key improvements made to Nizam:

1. **Brand & Logo**: Rebranded the app to **Nizam** (representing system and discipline) and added a custom, glossy 3D-styled gold, silver, and green logo.
2. **Habit Categorization**: Users can now assign habits to categories (General, Health, Study, Spiritual, Productivity) and filter the entire dashboard to view specific habits.
3. **Daily Quotations**: Integrated a daily motivational quote bar that updates automatically every midnight.
4. **Context-Aware Smart Reminders**: Added in-app evening check-ins (after 8:00 PM) and high-priority streak warnings (after 10:00 PM), along with native browser push notifications to protect user streaks.
5. **Progress Notes**: You can double-click or right-click any cell to add notes. Cells display a glowing gold indicator, and notes show up in a tooltip on hover.
6. **Weekly Summary Reports**: Provides an overall grade (A/B/C/D/F), "Star Performer", and "Needs Attention" breakdown to track weekly progress.
7. **CSV Data Export**: A one-click export button that downloads all habit logs in standard CSV format.

---

## 5. AI Tools Used

- **Gemini**: Used for designing and suggesting the 3D-style logo.
- **Antigravity**: Used as a pair-programmer for developing the React components, logic, and CSS code.
- **Comet**: Used for brainstorming features and suggesting UX improvements.