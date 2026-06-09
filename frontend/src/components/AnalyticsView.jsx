import React from 'react';
import { BarChart2, Activity, ShieldCheck, Code, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsView({ history, onOpenSidebar }) {
  
  // Calculate basic stats
  const totalReviews = history.length;
  const avgScore = totalReviews > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.review?.score || 0), 0) / totalReviews)
    : 0;
  
  const totalBugs = history.reduce((acc, curr) => acc + (curr.review?.bugs?.length || 0), 0);
  const totalSecurity = history.reduce((acc, curr) => acc + (curr.review?.security?.length || 0), 0);

  // Group by language
  const langStats = history.reduce((acc, curr) => {
    acc[curr.language] = (acc[curr.language] || 0) + 1;
    return acc;
  }, {});

  const maxLangCount = Math.max(...Object.values(langStats), 1);

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 w-full animate-fadeIn">
      
      <div className="mb-8 flex items-center gap-4">
        {onOpenSidebar && (
          <button 
            onClick={onOpenSidebar}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-emerald-500" /> Analytics Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Data-driven insights from your recent code reviews.
          </p>
        </div>
      </div>

      {totalReviews === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl border-dashed">
          <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No analytics data available.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Run your first code review to generate insights.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl p-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                <Target className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Avg Score</span>
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">
                {avgScore}<span className="text-lg text-gray-400">/100</span>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl p-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                <Code className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Total Reviews</span>
              </div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {totalReviews}
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl p-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                <Activity className="w-4 h-4 text-amber-500" /> <span className="text-xs font-bold uppercase tracking-wider">Bugs Found</span>
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">
                {totalBugs}
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl p-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-4 h-4 text-red-500" /> <span className="text-xs font-bold uppercase tracking-wider">Security Issues</span>
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">
                {totalSecurity}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Language Distribution</h3>
            <div className="flex flex-col gap-4">
              {Object.entries(langStats).map(([lang, count]) => {
                const percentage = (count / maxLangCount) * 100;
                return (
                  <div key={lang} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{lang}</span>
                      <span className="text-gray-500">{count} reviews</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
