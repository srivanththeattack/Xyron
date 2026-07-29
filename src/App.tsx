import { useState } from 'react';
import Dashboard from './components/Dashboard';
import InstanceView from './components/InstanceView';
import { AnimatePresence } from 'framer-motion';
import { InstanceType } from './types/instance';

function App() {
  const [view, setView] = useState<'dashboard' | 'instance'>('dashboard');
  const [currentInstanceType, setCurrentInstanceType] = useState<InstanceType>('general');

  const handleLaunch = (type: InstanceType) => {
    setCurrentInstanceType(type);
    setView('instance');
  };

  return (
    <div className="wavy-bg h-screen w-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <Dashboard key="dashboard" onLaunch={handleLaunch} />
        ) : (
          <InstanceView key="instance" onExit={() => setView('dashboard')} type={currentInstanceType} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
