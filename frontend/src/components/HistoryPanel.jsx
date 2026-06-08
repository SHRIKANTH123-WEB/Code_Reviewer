import React from 'react';
import { Clock, Trash2, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoryPanel({ isOpen, onClose, history, onLoadHistory, onClearHistory }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-dark-bg border-l border-light-border dark:border-dark-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Clock className="w-5 h-5 text-emerald-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Review History</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 gap-3">
                  <Clock className="w-12 h-12 opacity-20" />
                  <p className="text-sm">No previous reviews found.<br/>Your history will appear here.</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="group flex flex-col p-4 bg-gray-50 dark:bg-gray-900/30 border border-light-border dark:border-dark-border rounded-2xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md">
                        {item.language}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-4 line-clamp-2 leading-relaxed">
                      Score: <span className={item.review.score >= 80 ? 'text-emerald-500' : item.review.score >= 60 ? 'text-amber-500' : 'text-red-500'}>{item.review.score}/100</span> — {item.review.summary}
                    </p>
                    <button 
                      onClick={() => onLoadHistory(item)}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm rounded-xl transition-colors"
                    >
                      Load Review <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {history.length > 0 && (
              <div className="p-6 border-t border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-gray-900/50">
                <button 
                  onClick={onClearHistory}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold text-sm rounded-xl border border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Clear All History
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
