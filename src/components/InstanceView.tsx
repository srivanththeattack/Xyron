import React from 'react';
import { motion } from 'framer-motion';
import InstanceTopbar from './InstanceTopbar';
import InstanceDock from './InstanceDock';
import TerminalWindow from './TerminalWindow';
import { InstanceType } from '../types/instance';

interface InstanceViewProps {
  onExit: () => void;
  type: InstanceType;
}

const InstanceView: React.FC<InstanceViewProps> = ({ onExit, type }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      <InstanceTopbar onExit={onExit} />
      <div className="flex-grow relative">
        <TerminalWindow type={type} />
      </div>
      <InstanceDock />
    </motion.div>
  );
};

export default InstanceView;
