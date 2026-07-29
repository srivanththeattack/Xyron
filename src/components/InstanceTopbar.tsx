import React, { useState, useRef, useEffect } from 'react';
import { sanitizeInput } from '../utils/sanitize';

interface InstanceTopbarProps {
  onExit: () => void;
  onSearch?: (query: string) => void;
  onTogglePanel?: () => void;
  panelActive?: boolean;
}

const InstanceTopbar: React.FC<InstanceTopbarProps> = ({ onExit, onSearch, onTogglePanel, panelActive }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i' && onTogglePanel) {
        e.preventDefault();
        onTogglePanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePanel]);

  const handleSearch = (value: string) => {
    const sanitized = sanitizeInput(value);
    setSearchQuery(value);
    onSearch?.(sanitized);
  };

  return (
    <div className="glass h-10 flex items-center justify-between px-6 mx-4 mt-4 rounded-full text-sm z-10 relative">
      <div className="flex items-center gap-3">
        <button onClick={onExit} className="text-zinc-400 hover:text-white transition cursor-pointer text-xs">
          ← Exit
        </button>
        {onTogglePanel && (
          <button
            onClick={onTogglePanel}
            className={`text-xs transition cursor-pointer ${
              panelActive ? 'text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'
            }`}
            title="Toggle Info Panel (⌘I)"
          >
            {panelActive ? '◈ Info' : '◇ Info'}
          </button>
        )}
      </div>
      
      <div className="relative flex-1 max-w-md mx-4">
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder={searchFocused ? 'Search commands, files...' : 'Search...  ⌘K'}
          className="w-full bg-transparent text-zinc-300 text-center text-sm focus:outline-none placeholder-zinc-600"
        />
      </div>

      <div className="text-zinc-500 tabular-nums text-xs">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default InstanceTopbar;
