import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InstanceTopbar from './InstanceTopbar';
import InstanceDock from './InstanceDock';
import TerminalWindow from './TerminalWindow';
import UtilityTray from './UtilityTray';
import SafetyChrome from './SafetyChrome';
import Chat from './Chat';
import { InstanceType } from '../types/instance';
import { spawnInstance } from '../services/orchestrator';

interface InstanceViewProps {
  onExit: () => void;
  type: InstanceType;
}

type ActiveApp = 'terminal' | 'browser' | 'files' | 'chat' | 'network' | null;

const InstanceView: React.FC<InstanceViewProps> = ({ onExit, type }) => {
  const [activeApp, setActiveApp] = useState<ActiveApp>('terminal');

  useEffect(() => {
    spawnInstance(type);
  }, [type]);

  const handleOpenApp = (app: string) => {
    const validApps: ActiveApp[] = ['terminal', 'browser', 'files', 'chat', 'network'];
    if (validApps.includes(app as ActiveApp)) {
      setActiveApp(app as ActiveApp);
    }
  };

  const handleSearch = (query: string) => {
    if (query) {
      console.log(`[Search] Query: ${query}`);
    }
  };

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'chat':
        return (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 p-4">
            <Chat />
          </motion.div>
        );
      case 'terminal':
      default:
        return <TerminalWindow type={type} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      <InstanceTopbar onExit={onExit} onSearch={handleSearch} />
      <SafetyChrome type={type} />
      
      <div className="flex-grow relative">
        <AnimatePresence mode="wait">
          {renderActiveApp()}
        </AnimatePresence>
      </div>

      <UtilityTray />
      <InstanceDock onOpenApp={handleOpenApp} />
    </motion.div>
  );
};

export default InstanceView;
