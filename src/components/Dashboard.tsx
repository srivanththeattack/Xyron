import React from 'react';
import { motion } from 'framer-motion';
import { InstanceType, InstanceSecurityConfig } from '../types/instance';

interface DashboardProps {
  onLaunch: (type: InstanceType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLaunch }) => {
  const instances: { name: string; type: InstanceType; description: string }[] = [
    { name: 'General Work', type: 'general', description: 'Productivity & everyday tasks' },
    { name: 'Red Teaming', type: 'red-team', description: 'Offensive security tooling' },
    { name: 'Privacy', type: 'privacy', description: 'Tor-routed anonymous session' },
  ];

  return (
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
          onClick={() => onLaunch('general')}
          className="w-full bg-white text-black py-2 rounded-xl font-medium hover:bg-zinc-200 transition"
        >
          New Instance
        </button>
      </aside>
      <main className="flex-grow p-12">
        <h1 className="text-6xl font-light mb-12">Hello, Madhu</h1>
        <div className="grid grid-cols-3 gap-6">
          {instances.map((inst) => (
            <div 
              key={inst.type} 
              onClick={() => onLaunch(inst.type)} 
              className={`glass p-6 rounded-2xl cursor-pointer hover:bg-white/10 transition border-2 ${InstanceSecurityConfig[inst.type].color}`}
            >
              <h3 className="text-xl mb-2">{inst.name}</h3>
              <p className="text-sm text-zinc-500">{inst.description}</p>
            </div>
          ))}
        </div>
      </main>
    </motion.div>
  );
};

export default Dashboard;
