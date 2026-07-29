import React from 'react';

const DesktopShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="wavy-bg h-screen w-screen flex flex-col p-4">
      <header className="flex justify-between items-center text-zinc-500 text-sm mb-4">
        <div>Xyron OS</div>
        <div>{new Date().toLocaleTimeString()}</div>
      </header>
      <main className="flex-grow relative">
        {children}
      </main>
    </div>
  );
};

export default DesktopShell;
