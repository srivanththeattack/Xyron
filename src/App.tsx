import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import InstanceView from './components/InstanceView';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [view, setView] = useState<'dashboard' | 'instance'>('dashboard');

  return (
    <div className="wavy-bg h-screen w-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <Dashboard key="dashboard" onLaunch={() => setView('instance')} />
        ) : (
          <InstanceView key="instance" onExit={() => setView('dashboard')} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
