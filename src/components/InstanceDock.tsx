import React from 'react';
import { motion } from 'framer-motion';

interface InstanceDockProps {
  onOpenApp?: (app: string) => void;
}

const InstanceDock: React.FC<InstanceDockProps> = ({ onOpenApp }) => {
  const apps = [
    { name: 'Terminal', icon: '>_' },
    { name: 'Browser', icon: '🌐' },
    { name: 'Files', icon: '📁' },
    { name: 'Chat', icon: '💬' },
    { name: 'Network', icon: '🔌' },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }} animate={{ y: 0 }}
      className="glass mx-auto mb-6 px-6 py-3 rounded-3xl flex gap-6"
    >
      {apps.map(app => (
        <motion.button
          key={app.name}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpenApp?.(app.name.toLowerCase())}
          className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center justify-center text-xs text-zinc-400 transition-colors cursor-pointer"
          title={app.name}
        >
          <span className="text-base">{app.icon}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default InstanceDock;
