import React from 'react';

const FilesView: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full text-zinc-500">
      <div className="text-center">
        <div className="text-4xl mb-4">📁</div>
        <p className="text-sm">Filesystem</p>
        <p className="text-xs text-zinc-600 mt-1">Ephemeral storage — nothing persists</p>
      </div>
    </div>
  );
};

export default FilesView;
