import React from 'react';
import Window from './Window';
import { InstanceType } from '../types/instance';

interface TerminalWindowProps {
  type: InstanceType;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ type }) => {
  return (
    <Window title="System Terminal" type={type}>
      <div className="text-zinc-200 font-mono text-sm">
        root@xyron:~$ _
      </div>
    </Window>
  );
};

export default TerminalWindow;
