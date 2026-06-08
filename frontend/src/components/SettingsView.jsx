import React, { useState, useEffect } from 'react';
import { Key, Save, ShieldAlert, CheckCircle2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsView() {
  const [apiKey, setApiKey] = useState('');
  const [savedStatus, setSavedStatus] = useState(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('customGeminiApiKey');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('customGeminiApiKey', apiKey.trim());
    } else {
      localStorage.removeItem('customGeminiApiKey');
    }
    
    setSavedStatus('saved');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-6 w-full animate-fadeIn">
      
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-500" /> Settings
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your application preferences and API integrations.
        </p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-gray-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl">
              <Key className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Custom API Key</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Override the default backend API key to bypass rate limits.</p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
            <ShieldAlert className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              <p className="font-semibold mb-1">Why use a Custom API Key?</p>
              <p>If you are experiencing "Quota Exceeded (limit: 0)" errors, it means the default server key is restricted in your region (e.g., EU/UK). Generating your own key in Google AI Studio and pasting it here will bypass that restriction because it runs under your own Google account!</p>
              <p className="mt-2 text-xs opacity-80">Note: Your key is securely saved locally in your browser's localStorage. It is only sent to the local backend during analysis.</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Gemini API Key
            </label>
            <div className="flex gap-3">
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
              />
              <button 
                onClick={handleSave}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                {savedStatus === 'saved' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
