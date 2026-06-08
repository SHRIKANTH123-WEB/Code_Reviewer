import React, { useState } from 'react';
import { GitBranch, Loader2, ArrowRight } from 'lucide-react';

export default function GithubFetch({ onCodeFetched }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractRawUrl = (inputUrl) => {
    // If it's already a raw URL, return it
    if (inputUrl.includes('raw.githubusercontent.com')) return inputUrl;

    // Convert github.com/user/repo/blob/main/file to raw.githubusercontent.com/user/repo/main/file
    try {
      const urlObj = new URL(inputUrl);
      if (urlObj.hostname === 'github.com') {
        const parts = urlObj.pathname.split('/').filter(Boolean);
        if (parts.length >= 5 && parts[2] === 'blob') {
          parts.splice(2, 1); // remove 'blob'
          return `https://raw.githubusercontent.com/${parts.join('/')}`;
        }
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const detectLanguage = (inputUrl) => {
    try {
      const urlObj = new URL(inputUrl);
      const pathname = urlObj.pathname;
      const lastDotIndex = pathname.lastIndexOf('.');
      if (lastDotIndex === -1) return null;
      
      const ext = pathname.substring(lastDotIndex + 1).toLowerCase();
      const extensionMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'mjs': 'javascript',
        'cjs': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'pyw': 'python',
        'java': 'java',
        'cpp': 'c++',
        'cc': 'c++',
        'cxx': 'c++',
        'h': 'c++',
        'hpp': 'c++',
        'sql': 'sql'
      };
      return extensionMap[ext] || null;
    } catch (e) {
      return null;
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setError(null);
    setLoading(true);

    const rawUrl = extractRawUrl(url.trim());
    if (!rawUrl) {
      setError('Invalid GitHub file URL. Make sure it points to a specific file.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error('Failed to fetch file. Make sure it is public.');
      
      const code = await response.text();
      const detectedLang = detectLanguage(url.trim());
      onCodeFetched(code, detectedLang);
      setUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFetch} className="relative flex flex-col w-full mb-4">
      <div className="flex items-center relative">
        <div className="absolute left-4 text-gray-400">
          <GitBranch className="w-5 h-5" />
        </div>
        <input 
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a GitHub file URL (e.g., github.com/.../file.js)"
          className="w-full bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl pl-12 pr-28 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-shadow"
        />
        <button 
          type="submit"
          disabled={loading || !url.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="flex items-center gap-1">Fetch <ArrowRight className="w-3.5 h-3.5" /></span>}
        </button>
      </div>
      {error && <span className="text-xs text-red-500 mt-2 px-1 font-medium">{error}</span>}
    </form>
  );
}
