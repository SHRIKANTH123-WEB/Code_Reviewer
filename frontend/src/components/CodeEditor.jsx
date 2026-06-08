import React, { useRef, useEffect } from 'react';
import { Trash2, ClipboardPaste } from 'lucide-react';

export default function CodeEditor({ code, onChange, placeholder, language }) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Sync scroll of textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  const handleClear = () => {
    onChange('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-light-border dark:bg-dark-card dark:border-dark-border rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-light-border dark:border-dark-border bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase ml-2 tracking-wider">
            {language} Editor
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePaste}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-light-border text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-dark-border dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors cursor-pointer"
            title="Paste from clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Paste</span>
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            title="Clear code"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative flex flex-1 overflow-hidden font-mono text-sm leading-relaxed">
        {/* Line Numbers gutter */}
        <div
          ref={lineNumbersRef}
          className="select-none py-4 text-right pr-4 pl-3 text-gray-400 border-r border-light-border dark:border-dark-border bg-gray-50 dark:bg-gray-900/30 overflow-hidden text-xs font-medium w-12"
        >
          {lineNumbers.map((line) => (
            <div key={line} className="h-6">
              {line}
            </div>
          ))}
        </div>

        {/* Text Input Area */}
        <div className="relative flex-1 h-full">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            placeholder={placeholder}
            spellCheck="false"
            className="w-full h-full p-4 bg-transparent outline-none resize-none border-none text-gray-800 dark:text-gray-200 overflow-y-auto block leading-6 font-mono text-sm"
            style={{ tabSize: 4 }}
            id="code-editor-textarea"
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-light-border dark:border-dark-border bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 dark:text-gray-400">
        <span>Lines: {lineCount}</span>
        <span>Characters: {code.length}</span>
      </div>
    </div>
  );
}
