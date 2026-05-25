// Date utility functions
// All dates use LOCAL timezone with ISO-style keys (YYYY-MM-DD)
// CRITICAL: Never use UTC methods (getUTCDate, etc.) — always use local

export function getTodayKey() {
  return formatDateKey(new Date());
}

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // If Sunday (0), go back 6 days to get to Monday
  // If Monday (1), diff is 0
  // If Tuesday (2), diff is -1
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDays(weekStart) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(weekStart, i));
  }
  return days;
}

export function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isToday(date) {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
}

export function isFutureDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() > today.getTime();
}

export function isPastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

export function isSameWeek(dateA, dateB) {
  const startA = getStartOfWeek(dateA);
  const startB = getStartOfWeek(dateB);
  return formatDateKey(startA) === formatDateKey(startB);
}

export function formatWeekRange(weekStart) {
  const weekEnd = addDays(weekStart, 6);
  const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const year = weekEnd.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}–${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay}–${endMonth} ${endDay}, ${year}`;
}

export function formatDayLabel(date, type = 'full') {
  if (type === 'short') {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
  }
  if (type === 'narrow') {
    return date.toLocaleDateString('en-US', { weekday: 'narrow' });
  }
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatDayNumber(date) {
  return date.getDate();
}

export function getRelativeDayLabel(date) {
  if (isToday(date)) return 'Today';
  if (isFutureDate(date)) return 'Future';
  return 'Past';
}