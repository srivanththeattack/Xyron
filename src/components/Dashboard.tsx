import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InstanceType, InstanceSecurityConfig, InstanceTooling } from '../types/instance';
import InstanceSelector from './InstanceSelector';

interface DashboardProps {
  onLaunch: (type: InstanceType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLaunch }) => {
  const [showSelector, setShowSelector] = useState(false);

  const featuredTypes: { name: string; type: InstanceType }[] = [
    { name: 'Cybersec', type: 'cybersec' },
    { name: 'Dev', type: 'dev' },
    { name: 'Private', type: 'private' },
    { name: 'General', type: 'general' },
  ];

  const handleLaunch = (type: InstanceType) => {
    setShowSelector(false);
    onLaunch(type);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex h-full"
      >
        <aside className="w-64 glass m-4 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-zinc-500 font-semibold mb-6">FluidGrid</h2>
            <ul className="space-y-4">
              <li className="text-zinc-300 cursor-pointer hover:text-white transition">Snapshots</li>
              <li className="text-zinc-300 cursor-pointer hover:text-white transition">Settings</li>
            </ul>
          </div>
          <button 
            onClick={() => setShowSelector(true)}
            className="w-full bg-white text-black py-2 rounded-xl font-medium hover:bg-zinc-200 transition"
          >
            New Instance
          </button>
        </aside>
        <main className="flex-grow p-12">
          <h1 className="text-6xl font-light mb-6">Hello, Madhu</h1>
          <p className="text-zinc-500 mb-10 text-sm">Select an environment or create a new instance</p>
          <div className="grid grid-cols-4 gap-5">
            {featuredTypes.map(({ name, type }) => {
              const config = InstanceSecurityConfig[type];
              const tools = InstanceTooling[type];
              return (
                <div
                  key={type}
                  onClick={() => handleLaunch(type)}
                  className={`glass p-5 rounded-2xl cursor-pointer hover:bg-white/10 transition border-2 ${config.color} group`}
                >
                  <div className="text-3xl mb-3">{config.icon}</div>
                  <h3 className="text-lg font-medium text-zinc-200 mb-1">{name}</h3>
                  <p className="text-xs text-zinc-500 mb-3">{config.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {tools.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-700/30 text-zinc-500">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </motion.div>

      <InstanceSelector
        open={showSelector}
        onSelect={handleLaunch}
        onClose={() => setShowSelector(false)}
      />
    </>
  );
};

export default Dashboard;
