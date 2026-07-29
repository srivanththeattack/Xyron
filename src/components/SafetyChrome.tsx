import React from 'react';
import { InstanceType, InstanceSecurityConfig } from '../types/instance';

interface SafetyChromeProps {
  type: InstanceType;
}

const SafetyChrome: React.FC<SafetyChromeProps> = ({ type }) => {
  const config = InstanceSecurityConfig[type];

  return (
    <div className={`fixed top-4 right-4 bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-lg border-2 ${config.color} text-sm text-zinc-300`}>
      Status: {config.label}
    </div>
  );
};

export default SafetyChrome;
