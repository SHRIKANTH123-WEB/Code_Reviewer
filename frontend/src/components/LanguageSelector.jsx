import React from 'react';
import { Terminal, Braces, Database, Code } from 'lucide-react';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: Braces, color: 'text-amber-400 bg-amber-400/10' },
  { id: 'typescript', name: 'TypeScript', icon: Braces, color: 'text-blue-500 bg-blue-500/10' },
  { id: 'python', name: 'Python', icon: Terminal, color: 'text-blue-400 bg-blue-400/10' },
  { id: 'java', name: 'Java', icon: Code, color: 'text-red-400 bg-red-400/10' },
  { id: 'c++', name: 'C++', icon: Code, color: 'text-sky-400 bg-sky-400/10' },
  { id: 'sql', name: 'SQL', icon: Database, color: 'text-emerald-400 bg-emerald-400/10' },
];

export default function LanguageSelector({ selectedLanguage, onChange, templates = [], activeTemplateIndex = 0, onTemplateChange }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          Programming Language
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => {
            const Icon = lang.icon;
            const isSelected = selectedLanguage === lang.id;
            
            return (
              <button
                key={lang.id}
                onClick={() => onChange(lang.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-white border-light-border text-gray-600 hover:bg-gray-50 dark:bg-dark-card dark:border-dark-border dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
                id={`lang-select-${lang.id}`}
              >
                <div className={`p-1 rounded-lg ${lang.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Variation Template Selector */}
      {templates.length > 0 && onTemplateChange && (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/30 p-2 rounded-xl border border-light-border dark:border-dark-border">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 pl-2">
            Code Template:
          </label>
          <select 
            value={activeTemplateIndex}
            onChange={(e) => onTemplateChange(Number(e.target.value))}
            className="flex-1 text-sm border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-gray-700 dark:text-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none font-medium cursor-pointer"
          >
            {templates.map((tpl, i) => (
              <option key={i} value={i}>{tpl.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
