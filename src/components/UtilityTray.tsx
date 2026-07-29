import React from 'react';

const UtilityTray: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 bg-zinc-800/80 backdrop-blur-md p-2 rounded-lg border border-zinc-700 flex gap-2">
      <button className="p-2 hover:bg-zinc-700 rounded-md text-zinc-300">Nmap</button>
      <button className="p-2 hover:bg-zinc-700 rounded-md text-zinc-300">Metasploit</button>
      <button className="p-2 hover:bg-zinc-700 rounded-md text-zinc-300">Browser</button>
    </div>
  );
};

export default UtilityTray;
