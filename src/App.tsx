import React from 'react';
import DesktopShell from './components/DesktopShell';
import Window from './components/Window';

function App() {
  return (
    <DesktopShell>
      <Window title="System Terminal">
        Running secure workspace instance...
      </Window>
    </DesktopShell>
  );
}

export default App;
