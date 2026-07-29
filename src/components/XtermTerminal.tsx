import React, { useRef, useEffect } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { InstanceType } from '../types/instance';

interface XtermTerminalProps {
  type: InstanceType;
}

const XtermTerminal: React.FC<XtermTerminalProps> = ({ type }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#0a0a0a',
        foreground: '#c0c0c0',
        cursor: '#c0c0c0',
        selectionBackground: '#404040',
        black: '#000000',
        red: '#e34c4c',
        green: '#4ce34c',
        yellow: '#e3e34c',
        blue: '#4c4ce3',
        magenta: '#e34ce3',
        cyan: '#4ce3e3',
        white: '#c0c0c0',
      },
      cursorBlink: true,
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      allowTransparency: true,
      rows: 20,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    term.writeln('╔══════════════════════════════════════════╗');
    term.writeln('║        Xyron OS — Secure Terminal        ║');
    term.writeln('╚══════════════════════════════════════════╝');
    term.writeln('');
    term.writeln(`Instance type: ${type}`);
    term.writeln(`Status: Running (ephemeral, zero-log mode)`);
    term.writeln('');
    term.write('root@xyron:~$ ');

    let currentLine = '';
    term.onKey(({ key, domEvent }) => {
      if (domEvent.key === 'Enter') {
        term.writeln('');
        const cmd = currentLine.trim().toLowerCase();
        if (cmd === 'help') {
          term.writeln('Available commands: help, whoami, ps, top, nmap, exit, clear, neofetch');
        } else if (cmd === 'whoami') {
          term.writeln('root');
        } else if (cmd === 'clear') {
          term.clear();
        } else if (cmd === 'neofetch') {
          term.writeln('OS: Xyron 0.1.0 (Web-Native)');
          term.writeln('Kernel: Web API');
          term.writeln('Shell: /bin/xyron');
          term.writeln('Resolution: 1920x1080');
          term.writeln('Environment: Ephemeral Container');
        } else if (cmd === 'exit') {
          term.writeln('Session terminated. Close the window to return.');
        } else if (cmd.startsWith('nmap')) {
          term.writeln('nmap: Socket operations are isolated in this container.');
          term.writeln('Use the UtilityTray to launch network tools.');
        } else if (cmd) {
          term.writeln(`command not found: ${cmd}`);
        }
        currentLine = '';
        term.write('root@xyron:~$ ');
      } else if (domEvent.key === 'Backspace') {
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          term.write('\b \b');
        }
      } else if (!domEvent.ctrlKey && !domEvent.altKey && key.length === 1) {
        currentLine += key;
        term.write(key);
      }
    });

    termInstance.current = term;

    const handleResize = () => {
      try { fitAddon.fit(); } catch {}
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [type]);

  return <div ref={terminalRef} className="h-full w-full" />;
};

export default XtermTerminal;
