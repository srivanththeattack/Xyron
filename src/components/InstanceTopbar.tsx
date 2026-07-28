import React from 'react';

const InstanceTopbar: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  return (
    <div className="glass h-10 flex items-center justify-between px-6 mx-4 mt-4 rounded-full text-sm">
      <button onClick={onExit} className="text-zinc-400 hover:text-white">Exit</button>
      <div className="text-zinc-300">Search...</div>
      <div className="text-zinc-300">{new Date().toLocaleTimeString()}</div>
    </div>
  );
};

export default InstanceTopbar;
