import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm
        dark:bg-dark-card dark:border-dark-border dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white
        bg-white border-light-border text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      aria-label="Toggle theme"
      id="theme-toggle-btn"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-500 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-emerald-600 transition-transform duration-500 hover:-rotate-12" />
      )}
    </button>
  );
}
