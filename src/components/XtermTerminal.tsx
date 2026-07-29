import React, { useRef, useEffect } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { InstanceType, InstanceSecurityConfig, getDefaultSecurityPolicy } from '../types/instance';

interface XtermTerminalProps {
  type: InstanceType;
}

const XtermTerminal: React.FC<XtermTerminalProps> = ({ type }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyPosRef = useRef(-1);
  const currentLineRef = useRef('');

  useEffect(() => {
    if (!terminalRef.current) return;

    const config = InstanceSecurityConfig[type];
    const term = new Terminal({
      theme: {
        background: '#0a0a0a',
        foreground: '#c0c0c0',
        cursor: config.color === 'border-red-600' ? '#ef4444'
               : config.color === 'border-cyan-500' ? '#22d3ee'
               : config.color === 'border-purple-500' ? '#a855f7'
               : '#c0c0c0',
        selectionBackground: '#404040',
        black: '#000000',
        red: '#e34c4c',
        green: '#4ce34c',
        yellow: '#e3e34c',
        blue: config.color === 'border-cyan-500' ? '#22d3ee' : '#4c4ce3',
        magenta: '#e34ce3',
        cyan: '#4ce3e3',
        white: '#c0c0c0',
      },
      cursorBlink: true,
      cursorStyle: 'bar',
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      allowTransparency: true,
      rows: 22,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    // ─── Type-specific commands ──────────────────────────────────────
    const typeCommands: Record<string, string[]> = {
      general: ['help', 'whoami', 'clear', 'date', 'echo', 'ls', 'pwd', 'cat', 'calc', 'docs'],
      cybersec: ['help', 'nmap', 'metasploit', 'msfconsole', 'burpsuite', 'nikto', 'wireshark', 'whoami', 'clear', 'ifconfig'],
      dev: ['help', 'node', 'npm', 'git', 'docker', 'python', 'gcc', 'vim', 'clear', 'ls'],
      private: ['help', 'tor', 'signal', 'gpg', 'clear', 'whoami', 'echo', 'torsocks'],
    };

    const commands = typeCommands[type] || typeCommands.general;

    // ─── Banner ──────────────────────────────────────────────────────
    const label = config.label.toUpperCase();
    term.writeln(`╔══════════════════════════════════════════╗`);
    term.writeln(`║     Xyron OS — ${label.padEnd(20)}║`);
    term.writeln(`╚══════════════════════════════════════════╝`);
    term.writeln('');
    term.writeln(`  Instance: ${config.label}  |  Type \`help\` for commands`);
    term.writeln('');

    const prompt = `\x1b[1;32mroot@xyron\x1b[0m:\x1b[1;34m~$\x1b[0m `;
    term.write(prompt);

    // ─── Command handler ─────────────────────────────────────────────
    let currentLine = '';
    const history: string[] = [];
    let historyPos = -1;

    const executeCommand = (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      if (trimmed) history.push(cmd);
      historyPos = history.length;
      currentLine = '';
      historyRef.current = history;
      historyPosRef.current = historyPos;
      currentLineRef.current = currentLine;

      const cybersecCmds: Record<string, string> = {
        nmap: `Starting Nmap 7.95 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}
Initiating SYN Stealth Scan on scanme.org
Discovered open port 22/tcp on scanme.org
Discovered open port 80/tcp on scanme.org
Discovered open port 443/tcp on scanme.org
Nmap done: 1 IP address (1 host up) scanned in 2.34s`,
        metasploit: `Metasploit Framework v6.4.36 (WebAssembly)
[+] Loaded 2347 modules
[+] Loaded 478 exploits
[+] Loaded 256 payloads
msf6 > `,
        msfconsole: `Starting Metasploit console...
[+] 478 exploits
[+] 256 payloads
[+] Encoder: 47
msf6 > `,
        burpsuite: `Burp Suite Professional v2026.8
Project: Xyron-Temp-${Math.random().toString(36).slice(2, 8)}
Temporary project — zero-log mode enabled
Proxy: http://127.0.0.1:8080`,
        nikto: `- Nikto v2.5.0
- Target IP: 127.0.0.1
- + Server: nginx/1.24.0
- + /: Server banner revealed.
- + /admin/: Admin login page found.
- Scan completed: 1 error(s), 12 item(s) reported`,
        wireshark: `Wireshark 4.4.0 (WebAssembly)
Capturing on 'eth0' (isolated interface)
No packets captured — network is isolated.
Use 'bridged' mode for live capture.`,
        ifconfig: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
      inet 172.16.0.2  netmask 255.255.255.0  broadcast 172.16.0.255
      inet6 fe80::xyron  prefixlen 64  scopeid 0x20<link>
      ether 00:xy:ron:00:00:01  txqueuelen 1000  (Ethernet)`,
      };

      const devCmds: Record<string, string> = {
        node: `Welcome to Node.js v22.8.0 (WebAssembly).
Type '.help' for more information.
> `,
        npm: `npm v10.8.0
Usage: npm <command>
Available: install, run, build, test, publish`,
        git: `git version 2.46.0 (WebAssembly)
usage: git <command> [<args>]
Available: clone, init, add, commit, push, pull, status`,
        docker: `Docker version 27.3.0 (WebAssembly)
Usage: docker <command>
Available: run, ps, stop, build, pull, exec`,
        python: `Python 3.12.5 (WebAssembly)
Type "help", "copyright", "credits" or "license" for more information.
>>> `,
        gcc: `gcc (Alpine 14.2.0) 14.2.0
Copyright (C) 2024 Free Software Foundation, Inc.
usage: gcc [options] file...`,
        vim: `Vim: Not installed in this container.
Try using the Browser or Files app instead.`,
      };

      const privateCmds: Record<string, string> = {
        tor: `Tor 0.4.8.12 running on WebAssembly.
Circuit established: 🇺🇸 US → 🇫🇷 FR → 🇩🇪 DE
Tor SOCKS proxy: 127.0.0.1:9050`,
        signal: `Signal Protocol 3.0
Identity key: Xyron-${Math.random().toString(36).slice(2, 10)}
Zero-log mode: Active
End-to-end encryption: Enabled`,
        gpg: `gpg (GnuPG) 2.4.5
Home: /root/.gnupg
Supported algorithms: RSA, ECC, ECDH, EdDSA`,
        torsocks: `torsocks 2.4.0
Wrapper configured: all traffic routed through Tor
DNS resolved via Tor: Enabled`,
      };

      const generalCmds: Record<string, string> = {
        calc: `Calculator:
  sqrt(144) = 12
  sin(30°) = 0.5
  ln(e) = 1`,
        docs: `Xyron Docs v0.2.0
Available guides:
  - Getting Started
  - Security Overview
  - Instance Lifecycle
  - API Reference

Use 'open <guide>' to view.`,
        date: new Date().toString(),
        echo: cmd.slice(5) || '',
        ls: `Desktop  Documents  Downloads  tools  .config  .xyron`,
        pwd: `/root`,
        cat: `cat: No file specified. Available: README, config, .xyronrc`,
      };

      // Handle commands
      if (trimmed === 'help') {
        term.writeln(`Available commands (${type} instance):`);
        commands.forEach(c => term.writeln(`  ${c}`));
        if (type === 'general') term.writeln('  calc, docs, date, echo, ls, pwd, cat');
      } else if (trimmed === 'whoami') {
        term.writeln(`xyron-${type}`);
      } else if (trimmed === 'clear') {
        term.clear();
      } else if (trimmed === 'neofetch') {
        term.writeln(`OS: Xyron 0.3.0 (Web-Native)`);
        term.writeln(`Kernel: Web API + WASM`);
        term.writeln(`Instance: ${config.label}`);
        term.writeln(`Security: ${getDefaultSecurityPolicy(type).network_mode.toUpperCase()}`);
        term.writeln(`Shell: /bin/xyron (zsh)`);
      } else if (trimmed === 'exit') {
        term.writeln('Session active. Close the window to terminate.');
      } else if (type === 'cybersec' && cybersecCmds[trimmed]) {
        term.writeln(cybersecCmds[trimmed]);
      } else if (type === 'dev' && devCmds[trimmed]) {
        term.writeln(devCmds[trimmed]);
      } else if (type === 'private' && privateCmds[trimmed]) {
        term.writeln(privateCmds[trimmed]);
      } else if (type === 'general' && generalCmds[trimmed]) {
        term.writeln(generalCmds[trimmed]);
      } else if (trimmed && trimmed !== 'help') {
        term.writeln(`bash: ${trimmed.split(' ')[0]}: command not found`);
      }
    };

    term.onKey(({ key, domEvent }) => {
      if (domEvent.key === 'Enter') {
        term.writeln('');
        executeCommand(currentLine);
        currentLine = '';
        // Re-run prompt color logic
        term.write(prompt);
      } else if (domEvent.key === 'Backspace') {
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          term.write('\b \b');
        }
      } else if (domEvent.key === 'ArrowUp') {
        if (history.length > 0 && historyPos > 0) {
          historyPos--;
          // Clear current line
          while (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write('\b \b');
          }
          currentLine = history[historyPos];
          term.write(currentLine);
        }
      } else if (domEvent.key === 'ArrowDown') {
        if (historyPos < history.length - 1) {
          historyPos++;
          while (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write('\b \b');
          }
          currentLine = history[historyPos];
          term.write(currentLine);
        } else {
          historyPos = history.length;
          while (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write('\b \b');
          }
        }
      } else if (!domEvent.ctrlKey && !domEvent.altKey && domEvent.key.length === 1) {
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
