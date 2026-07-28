import React from 'react';
import { motion } from 'framer-motion';

const InstanceDock: React.FC = () => {
  const apps = ['Terminal', 'Browser', 'Files', 'Settings'];
  return (
    <motion.div 
      initial={{ y: 100 }} animate={{ y: 0 }}
      className="glass mx-auto mb-6 px-6 py-3 rounded-3xl flex gap-6"
    >
      {apps.map(app => (
        <motion.div 
          key={app}
          whileHover={{ scale: 1.2 }}
          className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-xs text-zinc-400"
        >
          {app[0]}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default InstanceDock;
