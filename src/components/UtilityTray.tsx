import React, { useState } from 'react';
import { InstanceType, InstanceTooling } from '../types/instance';

interface UtilityTrayProps {
  type: InstanceType;
  onLaunchTool?: (tool: string) => void;
}

const UtilityTray: React.FC<UtilityTrayProps> = ({ type, onLaunchTool }) => {
  const [expanded, setExpanded] = useState(false);
  const tools = InstanceTooling[type] || [];

  const toolColors: Record<string, string> = {
    nmap: 'text-green-400 border-green-900/50 hover:bg-green-900/20',
    metasploit: 'text-red-400 border-red-900/50 hover:bg-red-900/20',
    burpsuite: 'text-orange-400 border-orange-900/50 hover:bg-orange-900/20',
    wireshark: 'text-blue-400 border-blue-900/50 hover:bg-blue-900/20',
    nikto: 'text-yellow-400 border-yellow-900/50 hover:bg-yellow-900/20',
    vscode: 'text-blue-400 border-blue-900/50 hover:bg-blue-900/20',
    terminal: 'text-zinc-300 border-zinc-700 hover:bg-zinc-800',
    default: 'text-zinc-400 border-zinc-700 hover:bg-zinc-800',
  };

  return (
    <div className="fixed bottom-20 left-4 z-40">
      <button
        onClick={() => setExpanded(!expanded)}
        className="bg-zinc-800/80 backdrop-blur-md p-2.5 rounded-lg border border-zinc-700 hover:bg-zinc-700/80 transition cursor-pointer"
        title="Toggle tool tray"
      >
        <span className="text-sm">{expanded ? '✕' : '🔧'}</span>
      </button>

      {expanded && (
        <div className="absolute bottom-12 left-0 bg-zinc-900/90 backdrop-blur-md p-2 rounded-lg border border-zinc-700 space-y-1 min-w-[140px] shadow-xl">
          <p className="text-[10px] text-zinc-600 px-2 pb-1 uppercase tracking-wider">{type} Tools</p>
          {tools.map(tool => {
            const colorClass = toolColors[tool] || toolColors.default;
            return (
              <button
                key={tool}
                onClick={() => {
                  onLaunchTool?.(tool);
                  setExpanded(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs border transition cursor-pointer ${colorClass}`}
              >
                {tool}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UtilityTray;
