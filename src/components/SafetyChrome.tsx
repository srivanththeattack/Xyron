import React from 'react';
import { InstanceType, InstanceSecurityConfig } from '../types/instance';

interface SafetyChromeProps {
  type: InstanceType;
}

const SafetyChrome: React.FC<SafetyChromeProps> = ({ type }) => {
  const config = InstanceSecurityConfig[type];

  const statusInfo = {
    general: 'Productivity Mode',
    cybersec: '🔴 Offensive — Network Isolated',
    dev: '💻 Development Mode',
    private: '🔒 Tor Active — Anonymized',
  };

  return (
    <div className={`fixed top-14 right-4 bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-lg border-2 ${config.color} text-sm text-zinc-300 z-40`}>
      <div className="flex items-center gap-2">
        <span className="text-base">{config.icon}</span>
        <div>
          <p className="text-xs font-medium">{config.label}</p>
          <p className="text-[10px] text-zinc-500">{statusInfo[type]}</p>
        </div>
      </div>
    </div>
  );
};

export default SafetyChrome;
