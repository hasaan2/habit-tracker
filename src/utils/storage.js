const STORAGE_KEYS = {
  habits: 'nizam:v1:habits',
  completions: 'nizam:v1:completions',
  notes: 'nizam:v1:notes',
  reminders: 'nizam:v1:reminders',
};

// Migration: move old keys to new namespace
(function migrateOldKeys() {
  try {
    const oldHabits = localStorage.getItem('habit-tracker:v1:habits');
    const oldCompletions = localStorage.getItem('habit-tracker:v1:completions');
    if (oldHabits && !localStorage.getItem(STORAGE_KEYS.habits)) {
      localStorage.setItem(STORAGE_KEYS.habits, oldHabits);
    }
    if (oldCompletions && !localStorage.getItem(STORAGE_KEYS.completions)) {
      localStorage.setItem(STORAGE_KEYS.completions, oldCompletions);
    }
  } catch (e) { /* ignore */ }
})();

export function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.habits);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Validate structure and migrate missing categories to "general"
    return parsed
      .filter(h => h && typeof h.id === 'string' && typeof h.name === 'string')
      .map(h => ({
        ...h,
        category: h.category || 'general'
      }));
  } catch (e) {
    console.warn('Failed to load habits from localStorage', e);
    return [];
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habits));
  } catch (e) {
    console.warn('Failed to save habits to localStorage', e);
  }
}

export function loadCompletions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.completions);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch (e) {
    console.warn('Failed to load completions from localStorage', e);
    return {};
  }
}

export function saveCompletions(completions) {
  try {
    localStorage.setItem(STORAGE_KEYS.completions, JSON.stringify(completions));
  } catch (e) {
    console.warn('Failed to save completions to localStorage', e);
  }
}

export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.notes);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch (e) {
    console.warn('Failed to load notes from localStorage', e);
    return {};
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  } catch (e) {
    console.warn('Failed to save notes to localStorage', e);
  }
}

export function loadReminderSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.reminders);
    if (!raw) return { eveningNudge: true, endOfDaySummary: true, browserPush: false };
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return { eveningNudge: true, endOfDaySummary: true, browserPush: false };
    }
    return {
      eveningNudge: parsed.eveningNudge !== false,
      endOfDaySummary: parsed.endOfDaySummary !== false,
      browserPush: !!parsed.browserPush,
    };
  } catch (e) {
    return { eveningNudge: true, endOfDaySummary: true, browserPush: false };
  }
}

export function saveReminderSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save reminder settings to localStorage', e);
  }
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.habits);
  localStorage.removeItem(STORAGE_KEYS.completions);
  localStorage.removeItem(STORAGE_KEYS.notes);
  localStorage.removeItem(STORAGE_KEYS.reminders);
}