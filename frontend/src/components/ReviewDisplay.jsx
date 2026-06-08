import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  Award, 
  Copy, 
  Check, 
  Code2, 
  Sparkles, 
  ListChecks,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import Prism from 'prismjs';
import { diffLines } from 'diff';

// Import Prism syntax highlighting languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-sql';

export default function ReviewDisplay({ reviewData, originalCode, language, onApplyFix }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('diff');
  const [copiedImproved, setCopiedImproved] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    // Trigger Prism highlight whenever tab is changed or reviewData is updated
    Prism.highlightAll();
  }, [activeTab, reviewData]);

  if (!reviewData) return null;

  const { score, summary, bugs = [], optimizations = [], security = [], bestPractices = [], improvedCode = '', bigO = null } = reviewData;
  const hasErrors = bugs.length > 0 || security.length > 0;

  useEffect(() => {
    if (!hasErrors && (activeTab === 'bugs' || activeTab === 'security')) {
      setActiveTab('overview');
    }
  }, [hasErrors, activeTab]);

  // Format language code for Prism classes
  const getPrismLanguageClass = (lang) => {
    const l = lang.toLowerCase();
    if (l === 'c++') return 'language-cpp';
    return `language-${l}`;
  };

  // Toggle item expansion
  const toggleExpand = (section, index) => {
    const key = `${section}-${index}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Copy Improved Code
  const handleCopyImproved = () => {
    navigator.clipboard.writeText(improvedCode);
    setCopiedImproved(true);
    setTimeout(() => setCopiedImproved(false), 2000);
  };

  // Copy Full Markdown Report
  const handleCopyReport = () => {
    const reportText = `
# Code Review Report
**Score**: ${score}/100

## 1. Summary
${summary}

## 2. Errors & Bugs Found (${bugs.length})
${bugs.length === 0 ? 'No issues identified.' : bugs.map((b, i) => `
### [${b.severity.toUpperCase()}] ${b.line || 'General'}
- **Description**: ${b.description}
- **Suggested Fix**: ${b.fix}
`).join('\n')}

## 3. Optimizations (${optimizations.length})
${optimizations.length === 0 ? 'No issues identified.' : optimizations.map((o, i) => `
### [Impact: ${o.impact.toUpperCase()}]
- **Description**: ${o.description}
- **Suggestion**: ${o.suggestion}
`).join('\n')}

## 4. Security Vulnerabilities (${security.length})
${security.length === 0 ? 'No issues identified.' : security.map((s, i) => `
### [Severity: ${s.severity.toUpperCase()}]
- **Description**: ${s.description}
- **Fix**: ${s.fix}
`).join('\n')}

## 5. Coding Best Practices (${bestPractices.length})
${bestPractices.length === 0 ? 'No issues identified.' : bestPractices.map((bp, i) => `
- **Violation**: ${bp.description}
- **Rationale**: ${bp.rationale}
`).join('\n')}

## 6. Improved Code
\`\`\`${language}
${improvedCode}
\`\`\`
    `.trim();

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Download Full Markdown Report
  const handleDownloadReport = () => {
    const reportText = `
# Code Review Report
**Score**: ${score}/100

## 1. Summary
${summary}

## 2. Errors & Bugs Found (${bugs.length})
${bugs.length === 0 ? 'No issues identified.' : bugs.map((b, i) => `
### [${b.severity?.toUpperCase() || 'ISSUE'}] ${b.line || 'General'}
- **Description**: ${b.description}
- **Suggested Fix**: ${b.fix}
`).join('\n')}

## 3. Optimizations (${optimizations.length})
${optimizations.length === 0 ? 'No issues identified.' : optimizations.map((o, i) => `
### [Impact: ${o.impact?.toUpperCase() || 'UNKNOWN'}]
- **Description**: ${o.description}
- **Suggestion**: ${o.suggestion}
`).join('\n')}

## 4. Security Vulnerabilities (${security.length})
${security.length === 0 ? 'No issues identified.' : security.map((s, i) => `
### [Severity: ${s.severity?.toUpperCase() || 'UNKNOWN'}]
- **Description**: ${s.description}
- **Fix**: ${s.fix}
`).join('\n')}

## 5. Coding Best Practices (${bestPractices.length})
${bestPractices.length === 0 ? 'No issues identified.' : bestPractices.map((bp, i) => `
- **Violation**: ${bp.description}
- **Rationale**: ${bp.rationale}
`).join('\n')}

## 6. Improved Code
\`\`\`${language}
${improvedCode}
\`\`\`
    `.trim();

    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina_code_review_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get score color
  const getScoreColor = (s) => {
    if (s >= 90) return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10';
    if (s >= 75) return 'text-blue-500 border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10';
    if (s >= 50) return 'text-amber-500 border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10';
    return 'text-red-500 border-red-500/20 bg-red-500/5 dark:bg-red-500/10';
  };

  // Get severity badge style
  const getSeverityStyle = (severity) => {
    const s = severity.toLowerCase();
    if (s === 'critical' || s === 'high') {
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/40';
    }
    if (s === 'warning' || s === 'medium') {
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/40';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/40';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Award },
    ...(hasErrors ? [
      { id: 'bugs', name: 'Bugs', count: bugs.length, icon: AlertTriangle, color: 'text-red-500' },
      { id: 'security', name: 'Security', count: security.length, icon: ShieldAlert, color: 'text-rose-500' }
    ] : []),
    { id: 'optimizations', name: 'Performance', count: optimizations.length, icon: TrendingUp, color: 'text-amber-500' },
    { id: 'bestPractices', name: 'Best Practices', count: bestPractices.length, icon: ListChecks, color: 'text-emerald-500' },
    { id: 'code', name: 'Refactored Code', icon: Code2, color: 'text-emerald-500' }
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-light-border dark:border-dark-border bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base font-bold text-gray-800 dark:text-white">Review Summary</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-light-border dark:border-dark-border text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 cursor-pointer transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export .md</span>
          </button>
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-light-border dark:border-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors shadow-sm"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-500">Report Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-gray-900/20 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? '' : tab.color || ''}`} />
              <span>{tab.name}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab.count > 0 
                    ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Score Ring and Summary Card */}
            <div className="flex flex-col md:flex-row gap-6 items-center border border-light-border dark:border-dark-border p-6 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30">
              <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-full border-2 border-dashed ${getScoreColor(score)} flex-shrink-0`}>
                <span className="text-3xl font-extrabold tracking-tight">{score}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Quality Score</span>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider text-left">Executive Summary</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-left">
                  {summary || 'Review completed successfully. No summary paragraph returned.'}
                </p>
              </div>
            </div>

            {/* Big O Complexity */}
            {bigO && (
              <div className="flex flex-col md:flex-row gap-4 p-6 border border-light-border dark:border-dark-border rounded-2xl bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Time Complexity</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{bigO.time}</span>
                </div>
                <div className="hidden md:block w-px bg-light-border dark:bg-dark-border mx-4"></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Space Complexity</span>
                  <span className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">{bigO.space}</span>
                </div>
                <div className="hidden md:block w-px bg-light-border dark:bg-dark-border mx-4"></div>
                <div className="flex-1 flex flex-col justify-center text-sm text-gray-600 dark:text-gray-300">
                  <p className="leading-relaxed">{bigO.details}</p>
                </div>
              </div>
            )}

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Bugs / Syntax', count: bugs.length, color: 'border-red-500/20 text-red-500 dark:bg-red-500/5 bg-red-500/5' },
                { name: 'Security Flaws', count: security.length, color: 'border-rose-500/20 text-rose-500 dark:bg-rose-500/5 bg-rose-500/5' },
                { name: 'Performance Issues', count: optimizations.length, color: 'border-amber-500/20 text-amber-500 dark:bg-amber-500/5 bg-amber-500/5' },
                { name: 'Best Practices', count: bestPractices.length, color: 'border-emerald-500/20 text-emerald-500 dark:bg-emerald-500/5 bg-emerald-500/5' }
              ].filter(card => hasErrors || (card.name !== 'Bugs / Syntax' && card.name !== 'Security Flaws')).map((card, idx) => (
                <div key={idx} className={`flex flex-col p-4 border rounded-2xl ${card.color} text-center ${!hasErrors ? 'col-span-2 md:col-span-2' : ''}`}>
                  <span className="text-2xl font-bold">{card.count}</span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">{card.name}</span>
                </div>
              ))}
            </div>

            {/* Quality status badge */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Status Check:</span>
                {!hasErrors ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle className="w-4 h-4" /> Code is Bug-Free & Secure!
                  </span>
                ) : score >= 85 ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle className="w-4 h-4" /> Code is looking great!
                  </span>
                ) : score >= 70 ? (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                    <AlertTriangle className="w-4 h-4" /> Healthy with minor warnings
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                    <AlertTriangle className="w-4 h-4" /> Refactoring highly recommended
                  </span>
                )}
              </div>

              {!hasErrors && (
                <div className="p-5 border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl animate-fadeIn">
                  <h4 className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4" /> How to Improve Your Code
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    Awesome! No bugs or security issues were found. To optimize your code further, review the <strong>{optimizations.length} Performance suggestion(s)</strong> and <strong>{bestPractices.length} Best Practice(s)</strong> listed in the tabs above, or see the final refactored solution in the <strong>Refactored Code</strong> tab.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BUGS */}
        {activeTab === 'bugs' && (
          <div className="flex flex-col gap-4 text-left">
            {bugs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 gap-2 border border-dashed border-light-border dark:border-dark-border rounded-2xl">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
                <p className="font-medium text-sm">No bugs or syntax errors identified!</p>
              </div>
            ) : (
              bugs.map((bug, index) => {
                const isExpanded = expandedItems[`bugs-${index}`] ?? true;
                return (
                  <div key={index} className="border border-light-border dark:border-dark-border rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-dark-bg">
                    <button
                      onClick={() => toggleExpand('bugs', index)}
                      className="flex items-center justify-between w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-900/30 text-left hover:bg-gray-100/30 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityStyle(bug.severity)}`}>
                          {bug.severity}
                        </span>
                        <span className="text-sm font-bold text-gray-800 dark:text-white">
                          {bug.line ? bug.line : 'Syntax/Logic Issue'}
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    {isExpanded && (
                      <div className="p-5 flex flex-col gap-4 border-t border-light-border dark:border-dark-border text-sm">
                        <div>
                          <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-1">Issue Description</h4>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{bug.description}</p>
                        </div>
                        <div className="p-3.5 bg-red-50/50 dark:bg-red-950/10 rounded-xl border border-red-100 dark:border-red-900/20">
                          <h4 className="font-bold text-red-800 dark:text-red-400 mb-1 flex items-center gap-1">
                            Suggested Fix
                          </h4>
                          <p className="text-red-700 dark:text-red-300 leading-relaxed whitespace-pre-line">{bug.fix}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: SECURITY */}
        {activeTab === 'security' && (
          <div className="flex flex-col gap-4 text-left">
            {security.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 gap-2 border border-dashed border-light-border dark:border-dark-border rounded-2xl">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
                <p className="font-medium text-sm">No security vulnerabilities found.</p>
              </div>
            ) : (
              security.map((sec, index) => {
                const isExpanded = expandedItems[`sec-${index}`] ?? true;
                return (
                  <div key={index} className="border border-light-border dark:border-dark-border rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-dark-bg">
                    <button
                      onClick={() => toggleExpand('sec', index)}
                      className="flex items-center justify-between w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-900/30 text-left hover:bg-gray-100/30 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityStyle(sec.severity)}`}>
                          {sec.severity}
                        </span>
                        <span className="text-sm font-bold text-gray-800 dark:text-white">
                          Vulnerability Audited
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    {isExpanded && (
                      <div className="p-5 flex flex-col gap-4 border-t border-light-border dark:border-dark-border text-sm">
                        <div>
                          <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-1">Threat Description</h4>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{sec.description}</p>
                        </div>
                        <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/10 rounded-xl border border-rose-100 dark:border-rose-900/20">
                          <h4 className="font-bold text-rose-800 dark:text-rose-400 mb-1">How to Secure</h4>
                          <p className="text-rose-700 dark:text-rose-300 leading-relaxed whitespace-pre-line">{sec.fix}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 4: PERFORMANCE */}
        {activeTab === 'optimizations' && (
          <div className="flex flex-col gap-4 text-left">
            {optimizations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 gap-2 border border-dashed border-light-border dark:border-dark-border rounded-2xl">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
                <p className="font-medium text-sm">No optimization issues found. Code is highly performant!</p>
              </div>
            ) : (
              optimizations.map((opt, index) => {
                const isExpanded = expandedItems[`opt-${index}`] ?? true;
                return (
                  <div key={index} className="border border-light-border dark:border-dark-border rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-dark-bg">
                    <button
                      onClick={() => toggleExpand('opt', index)}
                      className="flex items-center justify-between w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-900/30 text-left hover:bg-gray-100/30 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityStyle(opt.impact)}`}>
                          Impact: {opt.impact}
                        </span>
                        <span className="text-sm font-bold text-gray-800 dark:text-white">
                          Performance Improvement
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    {isExpanded && (
                      <div className="p-5 flex flex-col gap-4 border-t border-light-border dark:border-dark-border text-sm">
                        <div>
                          <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-1">Efficiency Issue</h4>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{opt.description}</p>
                        </div>
                        <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/10 rounded-xl border border-amber-100 dark:border-amber-900/20">
                          <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-1">Recommended Change</h4>
                          <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-line">{opt.suggestion}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 5: BEST PRACTICES */}
        {activeTab === 'bestPractices' && (
          <div className="flex flex-col gap-4 text-left">
            {bestPractices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 gap-2 border border-dashed border-light-border dark:border-dark-border rounded-2xl">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
                <p className="font-medium text-sm">No style or clean-coding issues found.</p>
              </div>
            ) : (
              bestPractices.map((bp, index) => {
                const isExpanded = expandedItems[`bp-${index}`] ?? true;
                return (
                  <div key={index} className="border border-light-border dark:border-dark-border rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-dark-bg">
                    <button
                      onClick={() => toggleExpand('bp', index)}
                      className="flex items-center justify-between w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-900/30 text-left hover:bg-gray-100/30 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-bold text-gray-800 dark:text-white truncate pr-4">
                          {bp.description}
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    {isExpanded && (
                      <div className="p-5 border-t border-light-border dark:border-dark-border text-sm">
                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-1">Rationale</h4>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{bp.rationale}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 6: REFACTORED CODE */}
        {activeTab === 'code' && (
          <div className="flex flex-col h-full gap-4 text-left animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                PROPOSED IMPROVEMENTS
              </span>
              <div className="flex gap-2">
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 mr-2">
                  <button onClick={() => setViewMode('diff')} className={`px-3 py-1 text-xs font-bold rounded-md ${viewMode === 'diff' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'} transition-all`}>Diff</button>
                  <button onClick={() => setViewMode('code')} className={`px-3 py-1 text-xs font-bold rounded-md ${viewMode === 'code' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'} transition-all`}>Code</button>
                </div>
                {onApplyFix && (
                  <button
                    onClick={() => onApplyFix(improvedCode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-sm shadow-emerald-500/25"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Apply Fix</span>
                  </button>
                )}
                <button
                  onClick={handleCopyImproved}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-light-border text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-dark-border dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {copiedImproved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-500 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Syntax Highlighted Improved Code Panel or Diff View */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-auto border border-light-border dark:border-dark-border relative max-h-[450px]">
              {viewMode === 'code' ? (
                <pre className={`p-5 ${getPrismLanguageClass(language)} overflow-x-auto`}>
                  <code className={getPrismLanguageClass(language)}>
                    {improvedCode}
                  </code>
                </pre>
              ) : (
                <div className="font-mono text-sm leading-relaxed whitespace-pre overflow-x-auto p-5 text-gray-800 dark:text-gray-300">
                  {diffLines(originalCode, improvedCode).map((part, index) => {
                    const colorClass = part.added 
                      ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                      : part.removed 
                        ? 'bg-red-500/20 text-red-800 dark:text-red-300 line-through opacity-70' 
                        : 'text-gray-600 dark:text-gray-400';
                    const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
                    return part.value.split('\n').map((line, i, arr) => {
                      if (i === arr.length - 1 && line === '') return null;
                      return (
                        <div key={`${index}-${i}`} className={`px-2 py-0.5 rounded-sm ${part.added || part.removed ? colorClass : ''}`}>
                          <span className="opacity-50 select-none mr-4 inline-block w-4">{prefix}</span>
                          <span>{line}</span>
                        </div>
                      );
                    });
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
