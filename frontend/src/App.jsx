import React, { useState, useEffect } from 'react';
import { Sparkles, Play, ShieldAlert, Cpu, RefreshCw, MessageSquare } from 'lucide-react';
import LanguageSelector from './components/LanguageSelector';
import CodeEditor from './components/CodeEditor';
import ReviewDisplay from './components/ReviewDisplay';
import ThemeToggle from './components/ThemeToggle';
import LandingPage from './components/LandingPage';
import HistoryPanel from './components/HistoryPanel';
import Sidebar from './components/Sidebar';
import AnalyticsView from './components/AnalyticsView';
import GithubFetch from './components/GithubFetch';
import AuthModal from './components/AuthModal';
import { History } from 'lucide-react';
// Premium default examples with common errors/vulnerabilities
const EXAMPLES = {
  javascript: [
    {
      name: "Horrific Security & Performance",
      code: `// Warning: DO NOT RUN THIS IN PRODUCTION
function processUserLogin(req, res) {
  var username = req.body.user;
  var password = req.body.pass;
  
  // SQL INJECTION VULNERABILITY
  var query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  db.execute(query, function(err, result) {
    if(err) { throw err; } // Unhandled exception crashes server
    
    if (result.length > 0) {
      // XSS VULNERABILITY
      res.send("<h1>Welcome " + username + "</h1>");
      
      // HORRIFIC PERFORMANCE: Blocking the event loop
      var token = '';
      for(var i=0; i<1000000000; i++) {
         token += Math.random().toString();
      }
      
      // HARDCODED SECRETS
      var jwtSecret = 'super_secret_key_12345';
      res.cookie('auth', token + jwtSecret);
    } else {
      res.send('Login Failed');
    }
  });
}`
    }
  ],
  typescript: [
    {
      name: "Any Type Abuse & Memory Leaks",
      code: `import * as fs from 'fs';

export class DataProcessor {
  private cache: any[] = []; // MEMORY LEAK

  public async processFile(filePath: any): Promise<any> {
    // USING ANY EVERYWHERE DEFEATS TS
    let data: any = fs.readFileSync(filePath); // SYNCHRONOUS I/O BLOCKING
    
    this.cache.push(data); // MEMORY NEVER CLEARED

    let parsed: any;
    try {
      parsed = eval('(' + data.toString() + ')'); // MASSIVE SECURITY FLAW: EVAL
    } catch(e) {
      console.log('Error parsing'); // POOR ERROR HANDLING
    }

    // BAD LOOP PERFORMANCE
    for(let i=0; i<this.cache.length; i++) {
        for(let j=0; j<this.cache.length; j++) {
            if(this.cache[i] == this.cache[j]) { // LOOSE EQUALITY
                console.log('Duplicate found');
            }
        }
    }
    
    return parsed;
  }
}`
    }
  ],
  python: [
    {
      name: "Command Injection & Resource Leaks",
      code: `import os
import sqlite3
import hashlib

def process_upload(filename, user_data):
    # RESOURCE LEAK: File never closed
    f = open(filename, 'r')
    content = f.read()
    
    # COMMAND INJECTION VULNERABILITY
    os.system('cat ' + filename + ' > backup.txt')
    
    # SQL INJECTION VULNERABILITY
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute(f"INSERT INTO uploads (name, data) VALUES ('{user_data['name']}', '{content}')")
    conn.commit()
    
    # WEAK CRYPTOGRAPHY
    md5_hash = hashlib.md5(content.encode()).hexdigest()
    
    # INEFFICIENT STRING CONCATENATION
    result_str = ""
    for char in content:
        result_str += char.upper()
        
    return md5_hash, result_str`
    }
  ],
  java: [
    {
      name: "Null Pointers & Thread Starvation",
      code: `import java.sql.*;
import java.io.*;

public class UserService {
    // HARDCODED CREDENTIALS
    private static final String DB_URL = "jdbc:mysql://localhost/test";
    private static final String USER = "admin";
    private static final String PASS = "password123";

    public void updateProfile(String userId, String newEmail) {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(DB_URL, USER, PASS);
            
            // SQL INJECTION
            String sql = "UPDATE users SET email = '" + newEmail + "' WHERE id = " + userId;
            Statement stmt = conn.createStatement();
            stmt.executeUpdate(sql);
            
            // NULL POINTER DANGER
            String logMsg = null;
            if(newEmail.contains("@")) {
                logMsg = "Email updated";
            }
            System.out.println(logMsg.length()); // WILL THROW NPE IF newEmail IS INVALID
            
            // THREAD BLOCKING / POOR PERFORMANCE
            Thread.sleep(5000); 
            
        } catch(Exception e) {
            // SWALLOWING EXCEPTIONS
            e.printStackTrace();
        } finally {
            // RESOURCE LEAK: Statement not closed properly, Connection might throw on close
            try { conn.close(); } catch(Exception ex) {}
        }
    }
}`
    }
  ],
  'c++': [
    {
      name: "Buffer Overflows & Memory Leaks",
      code: `#include <iostream>
#include <string.h>

void process_data(char* input) {
    // BUFFER OVERFLOW VULNERABILITY
    char buffer[50];
    strcpy(buffer, input); // UNSAFE FUNCTION
    
    // MEMORY LEAK
    int* data_array = new int[1000];
    for (int i = 0; i <= 1000; ++i) { // OFF BY ONE ERROR
        data_array[i] = i * 2;
    }
    
    // FORMAT STRING VULNERABILITY
    printf(input); 
    
    // USE AFTER FREE
    int* ptr = new int(10);
    delete ptr;
    *ptr = 20; 
    
    std::cout << "Processed: " << buffer << std::endl;
}

int main() {
    char malicious_input[] = "This string is definitely longer than fifty characters and will overflow the buffer.";
    process_data(malicious_input);
    return 0;
}`
    }
  ],

  sql: [
    {
      name: "Cartesian Products & Injection",
      code: `-- TERRIBLE PERFORMANCE: Cartesian product (missing JOIN conditions)
SELECT *
FROM users u, orders o, products p
WHERE u.status = 'active';

-- DROPPING DATA DANGER
TRUNCATE TABLE logs;

-- SQL INJECTION VECTOR (If used in dynamic SQL)
EXEC('SELECT * FROM users WHERE username = ''' + @UserInput + '''');

-- INEFFICIENT SUBQUERIES
SELECT u.id, (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id AND o.amount > 1000)
FROM users u;

-- NO INDEXES, FULL TABLE SCANS
SELECT * FROM massive_audit_log WHERE created_at LIKE '%2023%';`
    }
  ]
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeView, setActiveView] = useState('review');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [language, setLanguage] = useState('javascript');
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [code, setCode] = useState(EXAMPLES.javascript[0].code);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('reviewHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    localStorage.setItem('reviewHistory', JSON.stringify(history));
  }, [history]);

  // Apply Theme on load/change
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Change code editor language and load example
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setActiveTemplateIndex(0);
    setCode(EXAMPLES[newLang][0].code || '');
  };

  const handleTemplateChange = (index) => {
    setActiveTemplateIndex(index);
    setCode(EXAMPLES[language][index].code || '');
  };

  const loadHistoryItem = (item) => {
    setLanguage(item.language);
    setActiveTemplateIndex(-1); // Custom history loaded
    setCode(item.code);
    setReview(item.review);
    setIsHistoryOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Call backend REST API for code review
  const handleReviewCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review.');
      return;
    }

    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:48201';
      const response = await fetch(`${apiBaseUrl}/api/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Server error. Please try again.');
      }

      if (data.success && data.data) {
        setReview(data.data);
        // Save to history
        const newHistoryItem = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          language,
          code,
          review: data.data
        };
        setHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // Keep last 10
      } else {
        throw new Error('Invalid response structure received from API.');
      }
    } catch (err) {
      console.error(err);
      let errorMsg = err.message || 'Unable to connect to review server.';
      if (errorMsg === 'Failed to fetch' || errorMsg.toLowerCase().includes('failed to fetch')) {
        const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        if (isProd) {
          errorMsg = 'Failed to connect to the backend server. Make sure you have configured the VITE_API_URL environment variable in your Render settings pointing to your live backend URL (e.g., https://your-backend.onrender.com).';
        } else {
          errorMsg = 'Unable to connect to the local backend. Please make sure your backend server is running on port 48201.';
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen transition-all duration-300 dark:bg-dark-bg bg-light-bg text-gray-900 dark:text-gray-100 font-sans">
        <header className="absolute top-0 w-full z-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform duration-300">
               <Sparkles className="w-5 h-5 text-dark-bg" />
             </div>
             <span className="font-extrabold text-lg tracking-tight text-brand-primary">
               Lumina Code Reviewer
             </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
             <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-colors">How it works</a>
             <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-colors">Features</a>
          </nav>

          <div className="flex items-center gap-4">
             <button onClick={() => setShowAuthModal(true)} className="hidden md:block font-bold text-sm text-gray-700 dark:text-gray-300 hover:text-brand-primary transition-colors">Log in</button>
             <button onClick={() => setShowAuthModal(true)} className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-dark-bg text-sm font-bold rounded-lg shadow-md transition-colors hidden md:block">
               Sign Up
             </button>
             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>
        <LandingPage onLaunch={() => setShowAuthModal(true)} />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          onLogin={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
            setCurrentPage('app');
          }} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans transition-all duration-300 dark:bg-dark-bg bg-light-bg text-gray-900 dark:text-gray-100">
      
      {/* Dashboard Sidebar */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onGoToLanding={() => setCurrentPage('landing')} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        
        {/* Dynamic View Rendering */}
        {activeView === 'analytics' && <AnalyticsView history={history} onOpenSidebar={() => setIsSidebarOpen(true)} />}

        {activeView === 'review' && (
          <>
            {/* Top Bar for Code Review */}
            <header className="sticky top-0 z-30 w-full border-b border-light-border dark:border-dark-border bg-white/80 dark:bg-dark-bg/85 backdrop-blur-md transition-colors px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" /> Code Review Workspace
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-light-border dark:border-dark-border text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </button>
              </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">
              {/* Row 1: Language Selection & Actions */}
              <div className="flex flex-wrap items-end justify-between gap-4 border border-light-border dark:border-dark-border p-5 rounded-2xl bg-white dark:bg-dark-card shadow-sm">
                <LanguageSelector 
                  selectedLanguage={language} 
                  onChange={handleLanguageChange}
                  templates={EXAMPLES[language]}
                  activeTemplateIndex={activeTemplateIndex}
                  onTemplateChange={handleTemplateChange}
                />
                
                <button
                  onClick={handleReviewCode}
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/25 dark:hover:shadow-emerald-950/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                  id="review-btn"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Code...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Review Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Row 2: Grid Workspace */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[550px]">
                
                {/* Left Panel: Editor */}
                <div className="h-full flex flex-col min-h-[400px]">
                  <GithubFetch onCodeFetched={(fetchedCode, detectedLanguage) => {
                    setCode(fetchedCode);
                    if (detectedLanguage) {
                      setLanguage(detectedLanguage);
                      setActiveTemplateIndex(-1);
                    }
                  }} />
                  <CodeEditor
                    code={code}
                    onChange={setCode}
                    placeholder="Paste your source code here..."
                    language={language}
                  />
                </div>

                {/* Right Panel: Review Display */}
                <div className="h-full flex flex-col min-h-[400px]">
                  
                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-3 p-4 border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/15 rounded-2xl text-red-700 dark:text-red-400 text-sm animate-fadeIn mb-4">
                      <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 text-left">
                        <h4 className="font-bold">Analysis Failed</h4>
                        <p className="mt-1 leading-relaxed">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!review && !loading && !error && (
                    <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-light-border dark:border-dark-border rounded-2xl p-8 bg-white dark:bg-dark-card/50 text-center text-gray-500 dark:text-gray-400 shadow-sm transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-4">
                        <Cpu className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-bold text-gray-800 dark:text-white">Ready for Review</h3>
                      <p className="text-sm max-w-sm mt-1 leading-relaxed">
                        Choose a language, paste your code on the left, and click "Review Code" to trigger the AI analysis.
                      </p>
                    </div>
                  )}

                  {/* Loading State Shimmer UI */}
                  {loading && (
                    <div className="flex-1 flex flex-col border border-light-border dark:border-dark-border rounded-2xl bg-white dark:bg-dark-card shadow-sm p-6 gap-6">
                      <div className="flex items-center justify-between border-b border-light-border dark:border-dark-border pb-4">
                        <div className="flex items-center gap-3">
                          <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin" />
                          <div className="h-4 w-28 rounded animate-shimmer"></div>
                        </div>
                        <div className="h-8 w-24 rounded-xl animate-shimmer"></div>
                      </div>
                      <div className="flex items-center gap-6 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/20 border border-light-border dark:border-dark-border">
                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 dark:border-gray-800 flex-shrink-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full animate-shimmer"></div>
                        </div>
                        <div className="flex-1 flex flex-col gap-2.5">
                          <div className="h-4 w-1/4 rounded animate-shimmer"></div>
                          <div className="h-3 w-3/4 rounded animate-shimmer"></div>
                          <div className="h-3 w-1/2 rounded animate-shimmer"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="h-16 rounded-xl animate-shimmer"></div>
                        <div className="h-16 rounded-xl animate-shimmer"></div>
                        <div className="h-16 rounded-xl animate-shimmer"></div>
                        <div className="h-16 rounded-xl animate-shimmer"></div>
                      </div>
                      <div className="flex-1 flex flex-col gap-3 mt-4">
                        <div className="h-10 rounded-xl animate-shimmer"></div>
                        <div className="h-10 rounded-xl animate-shimmer"></div>
                        <div className="h-10 rounded-xl animate-shimmer text-left flex items-center px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Running static analysis rules & querying Gemini LLM...
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Review Results Display */}
                  {review && !loading && !error && (
                    <ReviewDisplay 
                      reviewData={review} 
                      originalCode={code} 
                      language={language} 
                      onApplyFix={(improved) => setCode(improved)}
                    />
                  )}

                </div>
              </div>
            </main>
          </>
        )}

        {/* Footer inside main content area */}
        <footer className="w-full border-t border-light-border dark:border-dark-border bg-white/50 dark:bg-dark-bg/50 py-4 transition-colors mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-2">
            <span>&copy; 2026 Lumina AI Reviewer. Nixtio Dashboard Edition.</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Powered by Gemini API
              </span>
            </div>
          </div>
        </footer>

      </div>

      <HistoryPanel 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onLoadHistory={(item) => {
          setActiveView('review');
          loadHistoryItem(item);
        }}
        onClearHistory={clearHistory}
      />
    </div>
  );
}
