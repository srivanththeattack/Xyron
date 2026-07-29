import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InstanceTopbar from './InstanceTopbar';
import InstanceDock from './InstanceDock';
import TerminalWindow from './TerminalWindow';
import UtilityTray from './UtilityTray';
import SafetyChrome from './SafetyChrome';
import Chat from './Chat';
import BrowserView from './BrowserView';
import FilesView from './FilesView';
import NetworkView from './NetworkView';
import { InstanceType } from '../types/instance';
import { spawnInstance } from '../services/orchestrator';

interface InstanceViewProps {
  onExit: () => void;
  type: InstanceType;
}

type ActiveApp = 'terminal' | 'browser' | 'files' | 'chat' | 'network';

const appList: ActiveApp[] = ['terminal', 'browser', 'files', 'chat', 'network'];

const InstanceView: React.FC<InstanceViewProps> = ({ onExit, type }) => {
  const [activeApp, setActiveApp] = useState<ActiveApp>('terminal');
  const [tiledLayout, setTiledLayout] = useState(false);

  useEffect(() => {
    spawnInstance(type);
  }, [type]);

  // Auto-tiling: Ctrl+Shift+T (Pop!_OS inspired)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 't') {
        e.preventDefault();
        setTiledLayout(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenApp = useCallback((app: string) => {
    if (appList.includes(app as ActiveApp)) {
      setActiveApp(app as ActiveApp);
    }
  }, []);

  const handleSearch = useCallback((_query: string) => {
    // Search handled by InstanceTopbar; placeholder for future filtering
  }, []);

  const renderAppView = (app: ActiveApp) => {
    switch (app) {
      case 'chat': return <Chat />;
      case 'browser': return <BrowserView />;
      case 'files': return <FilesView />;
      case 'network': return <NetworkView />;
      case 'terminal':
      default: return <TerminalWindow type={type} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      <InstanceTopbar onExit={onExit} onSearch={handleSearch} />
      <SafetyChrome type={type} />

      {tiledLayout && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 text-zinc-400 text-xs px-3 py-1 rounded-full border border-zinc-700">
          Tiling active — Ctrl+Shift+T to toggle
        </div>
      )}

      <div className="flex-grow relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeApp}-${tiledLayout}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
          >
            {renderAppView(activeApp)}
          </motion.div>
        </AnimatePresence>
      </div>

      <UtilityTray />
      <InstanceDock onOpenApp={handleOpenApp} />
    </motion.div>
  );
};

export default InstanceView;
