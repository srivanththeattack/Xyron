import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import SnapshotManager from './SnapshotManager';
import VPNPanel from './VPNPanel';
import TorCircuitView from './TorCircuit';
import ContainerStatsPanel from './ContainerStats';
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
  const [showPanel, setShowPanel] = useState(false);
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [panelTab, setPanelTab] = useState<'stats' | 'vpn' | 'tor' | 'snapshots'>('stats');

  // Spawn instance on mount
  useEffect(() => {
    const init = async () => {
      const instance = await spawnInstance(type);
      setInstanceId(instance.instance_id);
    };
    init();
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
    // Future: search across apps
  }, []);

  const renderAppView = useCallback((app: ActiveApp) => {
    switch (app) {
      case 'chat': return <Chat />;
      case 'browser': return <BrowserView />;
      case 'files': return <FilesView />;
      case 'network': return <NetworkView />;
      case 'terminal':
      default: return <TerminalWindow type={type} />;
    }
  }, [type]);

  const panelContent = useMemo(() => {
    switch (panelTab) {
      case 'stats':
        return <ContainerStatsPanel instanceId={instanceId} instanceType={type} />;
      case 'vpn':
        return <VPNPanel />;
      case 'tor':
        return <TorCircuitView />;
      case 'snapshots':
        return <SnapshotManager instanceType={type} instanceId={instanceId} />;
    }
  }, [panelTab, instanceId, type]);

  const panelTabs: { id: typeof panelTab; label: string; icon: string }[] = [
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'vpn', label: 'VPN', icon: '🔐' },
    { id: 'tor', label: 'Tor', icon: '🧅' },
    { id: 'snapshots', label: 'Snapshots', icon: '💾' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      <InstanceTopbar
        onExit={onExit}
        onSearch={handleSearch}
        onTogglePanel={() => setShowPanel(p => !p)}
        panelActive={showPanel}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 relative">
          <SafetyChrome type={type} />

          {tiledLayout && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 text-zinc-400 text-xs px-3 py-1 rounded-full border border-zinc-700">
              Tiling: Ctrl+Shift+T to toggle
            </div>
          )}

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

        {/* Right status panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-zinc-800 overflow-hidden flex flex-col bg-zinc-950/50"
            >
              {/* Panel tabs */}
              <div className="flex border-b border-zinc-800">
                {panelTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setPanelTab(tab.id)}
                    className={`flex-1 py-3 text-xs font-medium transition-colors ${
                      panelTab === tab.id
                        ? 'text-zinc-200 border-b-2 border-zinc-400'
                        : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Panel content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {panelContent}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <UtilityTray />
      <InstanceDock onOpenApp={handleOpenApp} />
    </motion.div>
  );
};

export default InstanceView;
