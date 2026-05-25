import React, { useState, useRef } from 'react';

const FORM_CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'health', label: 'Health' },
  { id: 'study', label: 'Study' },
  { id: 'spiritual', label: 'Spiritual' },
  { id: 'productivity', label: 'Productivity' }
];

export default function HabitForm({ onAddHabit, habits }) {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validateAndAdd = () => {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setError('Habit name is required.');
      return;
    }

    if (trimmed.length > 50) {
      setError('Habit name must be 50 characters or less.');
      return;
    }

    const isDuplicate = habits.some(
      h => h.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setError('This habit already exists.');
      return;
    }

    onAddHabit(trimmed, selectedCategory);
    setInputValue('');
    setSelectedCategory('general');
    setError('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      validateAndAdd();
    }
  };

  return (
    <div className="habit-form">
      <div className="form-row">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Add a new habit (e.g., Read 30min)"
          className="habit-input"
          aria-label="New habit name"
          aria-invalid={!!error}
          aria-describedby={error ? 'habit-error' : undefined}
          maxLength={55}
        />
        <button 
          onClick={validateAndAdd}
          className="add-btn"
          aria-label="Add habit"
        >
          Add Habit
        </button>
      </div>

      <div className="form-categories-label">Category</div>
      <div className="form-categories" role="radiogroup" aria-label="Habit category">
        {FORM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="radio"
            aria-checked={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`category-select-pill ${selectedCategory === cat.id ? 'selected' : ''}`}
          >
            <span className={`cat-dot ${cat.id}`} />
            {cat.label}
          </button>
        ))}
      </div>

      {error && (
        <p id="habit-error" className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}