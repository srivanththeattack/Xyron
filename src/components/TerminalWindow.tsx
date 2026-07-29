import React from 'react';
import Window from './Window';
import XtermTerminal from './XtermTerminal';
import { InstanceType } from '../types/instance';

interface TerminalWindowProps {
  type: InstanceType;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ type }) => {
  return (
    <Window title="System Terminal" type={type}>
      <div className="h-80">
        <XtermTerminal type={type} />
      </div>
    </Window>
  );
};

export default TerminalWindow;
