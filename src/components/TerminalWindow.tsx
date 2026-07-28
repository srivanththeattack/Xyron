import React from 'react';
import { motion } from 'framer-motion';

const TerminalWindow: React.FC = () => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-20 left-20 w-[600px] h-[400px] glass rounded-2xl p-6 shadow-2xl overflow-hidden"
    >
      <div className="flex gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-zinc-600" />
        <div className="w-3 h-3 rounded-full bg-zinc-600" />
        <div className="w-3 h-3 rounded-full bg-zinc-600" />
      </div>
      <div className="text-zinc-200 font-mono text-sm">
        root@xyron:~$ _
      </div>
    </motion.div>
  );
};

export default TerminalWindow;
