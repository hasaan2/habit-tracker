import React, { useState, useEffect } from 'react';

const QUOTES = [
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "If you cannot do great things, do small things in a great way.", author: "Napoleon Hill" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "You will never change your life until you change something you do daily.", author: "John C. Maxwell" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Consistency is more important than perfection.", author: "Unknown" },
  { text: "Atomic habits compound over time to build a different life.", author: "James Clear" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" },
  { text: "First we make our habits, then our habits make us.", author: "John Dryden" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is today.", author: "Chinese Proverb" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Your habits will determine your future.", author: "Jack Canfield" },
  { text: "Sow an act, and you reap a habit. Sow a habit, and you reap a character.", author: "Charles Reade" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "Be not afraid of going slowly, be afraid only of standing still.", author: "Chinese Proverb" },
  { text: "All big things come from small beginnings.", author: "James Clear" },
  { text: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson" },
  { text: "Success is not overnight. It's when every day you get a little better.", author: "Dwayne Johnson" },
  { text: "You don't have to be perfect, you just have to be consistent.", author: "Unknown" },
  { text: "Concentrate all your thoughts upon the work at hand.", author: "Alexander Graham Bell" },
  { text: "Discipline is the soul of an army. It makes small numbers formidable.", author: "George Washington" }
];

export default function QuoteBar() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Get day of the year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Choose quote based on day of year
    setQuoteIndex(dayOfYear % QUOTES.length);
  }, []);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const currentQuote = QUOTES[quoteIndex] || QUOTES[0];

  return (
    <div className="quote-bar" aria-live="polite">
      <div className="quote-content">
        <p className="quote-text">“{currentQuote.text}”</p>
        <span className="quote-author">— {currentQuote.author}</span>
      </div>
      <button 
        onClick={handleNextQuote} 
        className="quote-refresh-btn" 
        aria-label="Show another motivational quote"
        title="Cycle quote"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      </button>
    </div>
  );
}
