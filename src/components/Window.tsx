import React from 'react';
import { motion } from 'framer-motion';

interface WindowProps {
  title: string;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ title, children }) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl w-64 h-64 shadow-2xl overflow-hidden"
    >
      <div className="h-8 bg-zinc-800/50 flex items-center px-4 cursor-grab">
        <span className="text-xs text-zinc-400">{title}</span>
      </div>
      <div className="p-4 text-sm text-zinc-300">
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
