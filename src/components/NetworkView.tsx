import React from 'react';

const NetworkView: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full text-zinc-500">
      <div className="text-center">
        <div className="text-4xl mb-4">🔌</div>
        <p className="text-sm">Network Dashboard</p>
        <p className="text-xs text-zinc-600 mt-1">VPN: Connected • Tor: Active • Isolation: Strict</p>
      </div>
    </div>
  );
};

export default NetworkView;
