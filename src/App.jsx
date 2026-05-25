import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import HabitForm from './components/HabitForm.jsx';
import StatsBar from './components/StatsBar.jsx';
import WeekNavigator from './components/WeekNavigator.jsx';
import HabitGrid from './components/HabitGrid.jsx';
import EmptyState from './components/EmptyState.jsx';
import QuoteBar from './components/QuoteBar.jsx';
import WeeklySummary from './components/WeeklySummary.jsx';
import { 
  loadHabits, 
  saveHabits, 
  loadCompletions, 
  saveCompletions,
  loadNotes,
  saveNotes,
  loadReminderSettings,
  saveReminderSettings
} from './utils/storage.js';
import { getStartOfWeek, getWeekDays, addDays, getTodayKey, isSameWeek } from './utils/dateUtils.js';

function generateId() {
  return 'habit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

const CATEGORIES = [
  { id: 'all', label: 'All Habits' },
  { id: 'general', label: 'General' },
  { id: 'health', label: 'Health' },
  { id: 'study', label: 'Study' },
  { id: 'spiritual', label: 'Spiritual' },
  { id: 'productivity', label: 'Productivity' }
];

export default function App() {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({});
  const [notes, setNotes] = useState({});
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  
  // Note Modal state
  const [activeNoteCell, setActiveNoteCell] = useState(null); // { habitId, habitName, dateKey, noteText }
  const [modalText, setModalText] = useState('');

  // Reminders & Notifications state
  const [reminderSettings, setReminderSettings] = useState({ eveningNudge: true, endOfDaySummary: true, browserPush: false });
  const [showSettings, setShowSettings] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedHabits = loadHabits();
    const loadedCompletions = loadCompletions();
    const loadedNotes = loadNotes();
    const loadedReminders = loadReminderSettings();
    
    setHabits(loadedHabits);
    setCompletions(loadedCompletions);
    setNotes(loadedNotes);
    setReminderSettings(loadedReminders);
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      saveHabits(habits);
    }
  }, [habits, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveCompletions(completions);
    }
  }, [completions, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveNotes(notes);
    }
  }, [notes, isLoaded]);

  // Sync modal text when cell changes
  useEffect(() => {
    if (activeNoteCell) {
      setModalText(activeNoteCell.noteText || '');
    }
  }, [activeNoteCell]);

  // Context-Aware Notifications Engine
  useEffect(() => {
    if (!isLoaded || habits.length === 0) return;

    const checkReminders = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const todayKey = getTodayKey();
      
      // Find unchecked habits for today
      const uncheckedToday = habits.filter(habit => {
        const habitCompletions = completions[habit.id] || {};
        return habitCompletions[todayKey] !== true;
      });

      if (uncheckedToday.length === 0) {
        setActiveNotification(null);
        return;
      }

      let triggeredMessage = '';
      let triggeredTitle = '';
      let reminderId = '';

      if (currentHour >= 22 && reminderSettings.endOfDaySummary) {
        // 10 PM Nudge (Streak Warning)
        reminderId = `streak_warning_${todayKey}`;
        triggeredTitle = 'Streak Warning!';
        triggeredMessage = `You have ${uncheckedToday.length} habit${uncheckedToday.length > 1 ? 's' : ''} remaining. Check them off before midnight to save your streak! 🔥`;
      } else if (currentHour >= 20 && reminderSettings.eveningNudge) {
        // 8 PM Nudge (Evening reminder)
        reminderId = `evening_nudge_${todayKey}`;
        triggeredTitle = 'Evening Nudge';
        triggeredMessage = `Don't forget to complete your habits tonight: ${uncheckedToday.map(h => h.name).join(', ')}`;
      }

      if (triggeredMessage && reminderId) {
        // Check if we already showed this notification today
        const lastShown = localStorage.getItem('nizam:v1:last_shown_reminder');
        if (lastShown !== reminderId) {
          setActiveNotification({
            id: reminderId,
            title: triggeredTitle,
            message: triggeredMessage,
            type: currentHour >= 22 ? 'warning' : 'info'
          });

          // Trigger browser native push notification if permitted
          if (reminderSettings.browserPush && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(triggeredTitle, {
                body: triggeredMessage
              });
            } catch (err) {
              console.warn('Notification construction failed', err);
            }
          }
        }
      }
    };

    // Run check immediately on load/change
    checkReminders();
    
    // Set periodic scanner (every 60 seconds)
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [isLoaded, habits, completions, reminderSettings]);

  const handleDismissNotification = useCallback(() => {
    if (activeNotification) {
      localStorage.setItem('nizam:v1:last_shown_reminder', activeNotification.id);
      setActiveNotification(null);
    }
  }, [activeNotification]);

  const handleToggleReminderSetting = useCallback((key) => {
    setReminderSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      saveReminderSettings(updated);
      
      // Request browser push permission if enabled
      if (key === 'browserPush' && updated.browserPush) {
        if ('Notification' in window) {
          Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
              // Revert switch if permission denied
              setReminderSettings(curr => {
                const reverted = { ...curr, browserPush: false };
                saveReminderSettings(reverted);
                return reverted;
              });
            }
          });
        }
      }
      return updated;
    });
  }, []);

  const weekDays = getWeekDays(currentWeekStart);
  const isCurrentWeek = isSameWeek(currentWeekStart, new Date());

  const addHabit = useCallback((name, category = 'general') => {
    const newHabit = {
      id: generateId(),
      name,
      category,
      createdAt: getTodayKey(),
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const renameHabit = useCallback((habitId, newName) => {
    setHabits(prev =>
      prev.map(h => (h.id === habitId ? { ...h, name: newName } : h))
    );
  }, []);

  const deleteHabit = useCallback((habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCompletions(prev => {
      const next = { ...prev };
      delete next[habitId];
      return next;
    });
    setNotes(prev => {
      const next = { ...prev };
      delete next[habitId];
      return next;
    });
  }, []);

  const toggleCompletion = useCallback((habitId, dateKey) => {
    setCompletions(prev => {
      const habitCompletions = { ...prev[habitId] || {} };
      if (habitCompletions[dateKey]) {
        delete habitCompletions[dateKey];
      } else {
        habitCompletions[dateKey] = true;
      }
      if (Object.keys(habitCompletions).length === 0) {
        const next = { ...prev };
        delete next[habitId];
        return next;
      }
      return {
        ...prev,
        [habitId]: habitCompletions,
      };
    });
  }, []);

  const handleOpenNoteModal = useCallback((habitId, habitName, dateKey, noteText) => {
    setActiveNoteCell({ habitId, habitName, dateKey, noteText });
  }, []);

  const handleSaveNote = useCallback((text) => {
    if (!activeNoteCell) return;
    const { habitId, dateKey } = activeNoteCell;
    const trimmed = text.trim();
    
    setNotes(prev => {
      const habitNotes = { ...prev[habitId] || {} };
      if (trimmed) {
        habitNotes[dateKey] = trimmed;
      } else {
        delete habitNotes[dateKey];
      }
      
      const next = { ...prev };
      if (Object.keys(habitNotes).length === 0) {
        delete next[habitId];
      } else {
        next[habitId] = habitNotes;
      }
      return next;
    });
    setActiveNoteCell(null);
  }, [activeNoteCell]);

  const handleDeleteNote = useCallback(() => {
    if (!activeNoteCell) return;
    const { habitId, dateKey } = activeNoteCell;
    setNotes(prev => {
      const habitNotes = { ...prev[habitId] || {} };
      delete habitNotes[dateKey];
      const next = { ...prev };
      if (Object.keys(habitNotes).length === 0) {
        delete next[habitId];
      } else {
        next[habitId] = habitNotes;
      }
      return next;
    });
    setActiveNoteCell(null);
  }, [activeNoteCell]);

  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  }, []);

  const goToThisWeek = useCallback(() => {
    setCurrentWeekStart(getStartOfWeek(new Date()));
  }, []);

  const filteredHabits = habits.filter(
    h => selectedCategory === 'all' || h.category === selectedCategory
  );

  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading your habits...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <Header 
          habits={habits} 
          completions={completions} 
          notes={notes} 
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(prev => !prev)}
        />
        <QuoteBar />
        <HabitForm onAddHabit={addHabit} habits={habits} />

        {/* Smart Reminders Collapsible settings panel */}
        {showSettings && (
          <div className="reminder-settings-panel">
            <h2 className="settings-panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Smart Reminders Settings
            </h2>
            
            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">Evening Nudge</span>
                <span className="settings-desc">Alert after 8:00 PM if habits are still unchecked today</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={reminderSettings.eveningNudge} 
                  onChange={() => handleToggleReminderSetting('eveningNudge')} 
                />
                <span className="slider" />
              </label>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">Streak Warning</span>
                <span className="settings-desc">High-priority alert after 10:00 PM to protect your current streak</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={reminderSettings.endOfDaySummary} 
                  onChange={() => handleToggleReminderSetting('endOfDaySummary')} 
                />
                <span className="slider" />
              </label>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">Desktop Notifications</span>
                <span className="settings-desc">Send system notifications when running in the background</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={reminderSettings.browserPush} 
                  onChange={() => handleToggleReminderSetting('browserPush')} 
                />
                <span className="slider" />
              </label>
            </div>
          </div>
        )}

        {habits.length === 0 ? (
          <EmptyState onAddSuggestion={(name) => addHabit(name, 'general')} />
        ) : (
          <>
            <div className="category-filter-bar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                >
                  {cat.id !== 'all' && <span className={`cat-dot ${cat.id}`} />}
                  {cat.label}
                </button>
              ))}
            </div>

            <StatsBar
              habits={filteredHabits}
              completions={completions}
              weekDays={weekDays}
            />
            <WeekNavigator
              currentWeekStart={currentWeekStart}
              onPrevious={goToPreviousWeek}
              onNext={goToNextWeek}
              onToday={goToThisWeek}
              showSummary={showWeeklySummary}
              onToggleSummary={() => setShowWeeklySummary(prev => !prev)}
            />

            {showWeeklySummary && (
              <WeeklySummary
                habits={filteredHabits}
                completions={completions}
                weekDays={weekDays}
              />
            )}

            <div className="grid-wrapper">
              {filteredHabits.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p>No habits under this category yet.</p>
                </div>
              ) : (
                <HabitGrid
                  habits={filteredHabits}
                  weekDays={weekDays}
                  completions={completions}
                  onToggle={toggleCompletion}
                  onRename={renameHabit}
                  onDelete={deleteHabit}
                  isCurrentWeek={isCurrentWeek}
                  notes={notes}
                  onOpenNoteModal={handleOpenNoteModal}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Note Modal */}
      {activeNoteCell && (
        <div className="modal-overlay" onClick={() => setActiveNoteCell(null)}>
          <div className="note-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Progress Note</h2>
              <button 
                className="modal-close-btn" 
                onClick={() => setActiveNoteCell(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <p className="modal-subtitle">{activeNoteCell.habitName} — {activeNoteCell.dateKey}</p>
            <textarea
              className="note-textarea"
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
              placeholder="What went well? Any obstacles? (Max 200 chars)"
              maxLength={200}
              autoFocus
            />
            <div className="modal-actions">
              {activeNoteCell.noteText && (
                <button
                  className="modal-btn delete-note"
                  onClick={handleDeleteNote}
                >
                  Delete
                </button>
              )}
              <button className="modal-btn cancel" onClick={() => setActiveNoteCell(null)}>Cancel</button>
              <button
                className="modal-btn save"
                onClick={() => handleSaveNote(modalText)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sliding Notification Banner */}
      {activeNotification && (
        <div className="notification-banner-container">
          <div className="notification-banner">
            <div className={`notification-icon ${activeNotification.type === 'warning' ? 'warning' : ''}`}>
              {activeNotification.type === 'warning' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              )}
            </div>
            <div className="notification-body">
              <h3 className="notification-title">{activeNotification.title}</h3>
              <p className="notification-message">{activeNotification.message}</p>
            </div>
            <button 
              className="notification-close-btn" 
              onClick={handleDismissNotification}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}