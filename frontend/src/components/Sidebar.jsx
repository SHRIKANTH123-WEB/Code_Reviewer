import React from 'react';
import { Code2, BarChart2, Settings, Sparkles, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({ activeView, setActiveView, onGoToLanding, theme, toggleTheme }) {
  const navItems = [
    { id: 'review', label: 'Code Review', icon: Code2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-light-border dark:border-dark-border bg-white dark:bg-dark-bg flex flex-col transition-colors z-40">
      
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-light-border dark:border-dark-border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors" onClick={onGoToLanding}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-gray-900 dark:text-white">
              Lumina AI
            </span>
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">
              Code Analytics
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-2">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">Main Menu</h3>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-light-border dark:border-dark-border flex flex-col gap-3">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Theme</span>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <button 
          onClick={onGoToLanding}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 opacity-70" />
          <span>Exit Dashboard</span>
        </button>
      </div>

    </aside>
  );
}
