import React from 'react';
import { motion } from 'framer-motion';
import { InstanceType, InstanceSecurityConfig } from '../types/instance';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  type: InstanceType;
}

const Window: React.FC<WindowProps> = ({ title, children, type }) => {
  const config = InstanceSecurityConfig[type];

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute bg-zinc-900/80 backdrop-blur-md border-2 ${config.color} rounded-xl shadow-2xl overflow-hidden`}
      style={{ width: '75%', height: '75%', left: '12.5%', top: '5%' }}
    >
      <div className={`h-8 bg-zinc-800/50 flex items-center px-4 cursor-grab border-b ${config.color}`}>
        <span className="text-xs text-zinc-400 flex items-center gap-2">
          <span>{config.icon}</span>
          {title} — {config.label}
        </span>
      </div>
      <div className="p-0 h-[calc(100%-2rem)]">
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
