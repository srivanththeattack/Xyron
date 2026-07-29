import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InstanceType, InstanceSecurityConfig, InstanceTooling } from '../types/instance';

interface InstanceSelectorProps {
  open: boolean;
  onSelect: (type: InstanceType) => void;
  onClose: () => void;
}

const instanceTypes: InstanceType[] = ['general', 'cybersec', 'dev', 'private'];

const InstanceSelector: React.FC<InstanceSelectorProps> = ({ open, onSelect, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-light text-zinc-200 mb-2">New Instance</h2>
            <p className="text-sm text-zinc-500 mb-6">Choose your workspace environment</p>

            <div className="grid grid-cols-2 gap-4">
              {instanceTypes.map(type => {
                const config = InstanceSecurityConfig[type];
                const tools = InstanceTooling[type];

                return (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(type)}
                    className={`text-left bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl p-5 border-2 ${config.color} transition-all group`}
                  >
                    <div className="text-3xl mb-3">{config.icon}</div>
                    <h3 className="text-lg font-medium text-zinc-200 mb-1">{config.label}</h3>
                    <p className="text-xs text-zinc-500 mb-3 leading-relaxed">{config.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tools.slice(0, 4).map(tool => (
                        <span
                          key={tool}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-700/50 text-zinc-400"
                        >
                          {tool}
                        </span>
                      ))}
                      {tools.length > 4 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-700/50 text-zinc-500">
                          +{tools.length - 4}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-2 text-sm text-zinc-600 hover:text-zinc-400 transition"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstanceSelector;
