import React from 'react';

const BrowserView: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full text-zinc-500">
      <div className="text-center">
        <div className="text-4xl mb-4">🌐</div>
        <p className="text-sm">Browser instance</p>
        <p className="text-xs text-zinc-600 mt-1">Isolated, zero-log session</p>
      </div>
    </div>
  );
};

export default BrowserView;
