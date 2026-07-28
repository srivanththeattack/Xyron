import React from 'react';
import { motion } from 'framer-motion';

interface DashboardProps {
  onLaunch: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLaunch }) => {
  const instances = ['General Work', 'Red Teaming', 'Privacy'];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex h-full"
    >
      <aside className="w-64 glass m-4 rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-zinc-500 font-semibold mb-6">Xyron</h2>
          <ul className="space-y-4">
            <li className="text-zinc-300">Snapshots</li>
            <li className="text-zinc-300">Settings</li>
          </ul>
        </div>
        <button 
          onClick={onLaunch}
          className="w-full bg-white text-black py-2 rounded-xl font-medium hover:bg-zinc-200 transition"
        >
          New Instance
        </button>
      </aside>
      <main className="flex-grow p-12">
        <h1 className="text-6xl font-light mb-12">Hello, Madhu</h1>
        <div className="grid grid-cols-3 gap-6">
          {instances.map((inst) => (
            <div key={inst} onClick={onLaunch} className="glass p-6 rounded-2xl cursor-pointer hover:bg-white/10 transition">
              <h3 className="text-xl">{inst}</h3>
            </div>
          ))}
        </div>
      </main>
    </motion.div>
  );
};

export default Dashboard;
