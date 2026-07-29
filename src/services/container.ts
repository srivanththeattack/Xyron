import { ContainerStats, InstanceType } from '../types/instance';

const runningContainers = new Map<string, { startTime: number }>();

export const startStatsTracking = (instanceId: string): void => {
  runningContainers.set(instanceId, { startTime: Date.now() });
};

export const stopStatsTracking = (instanceId: string): void => {
  runningContainers.delete(instanceId);
};

export const getContainerStats = async (instanceId: string, type: InstanceType): Promise<ContainerStats> => {
  const info = runningContainers.get(instanceId);
  const uptime = info ? (Date.now() - info.startTime) / 1000 : 0;

  const baseCpu: Record<InstanceType, number> = {
    general: 8, cybersec: 42, dev: 28, private: 15,
  };
  const baseMem: Record<InstanceType, number> = {
    general: 96, cybersec: 512, dev: 256, private: 128,
  };
  const memLimit: Record<InstanceType, number> = {
    general: 512, cybersec: 2048, dev: 1024, private: 256,
  };

  const cpu = baseCpu[type] || 12;
  const mem = baseMem[type] || 128;
  const limit = memLimit[type] || 512;

  await new Promise(r => setTimeout(r, 50));

  return {
    cpu_usage: Math.min(100, cpu + Math.random() * 15),
    memory_usage: Math.min(limit, mem + Math.random() * mem * 0.4),
    memory_limit: limit,
    uptime_seconds: uptime,
    network_rx: Math.floor(Math.random() * 1024 * 1024),
    network_tx: Math.floor(Math.random() * 512 * 1024),
  };
};

export const getBootLogs = (type: InstanceType): string[] => {
  const base = [
    `[kernel] Xyron micro-kernel v0.3.0 booting...`,
    `[kernel] CPU: WebAssembly (64-bit, 4 vCPUs)`,
    `[kernel] Memory: ${type === 'cybersec' ? '4GiB' : type === 'dev' ? '2GiB' : '1GiB'} available`,
    `[init] Starting init system...`,
  ];

  const typeLogs: Record<InstanceType, string[]> = {
    general: [
      `[system] Loading productivity suite...`,
      `[network] DHCP: 172.16.0.2/24`,
      `[tools] spreadsheets, presentations, documents, calculator`,
      `[system] Filesystem: read-write (ephemeral overlay)`,
    ],
    cybersec: [
      `[security] 🔴 Cybersec instance — network ISOLATED`,
      `[security] Capabilities dropped: ALL`,
      `[security] Root filesystem: read-only`,
      `[security] Zero-log policy enforced`,
      `[tools] Loading toolchain: nmap 7.95, Metasploit 6.4, Burp Suite 2026.8`,
      `[tools] Loading auxiliary: wireshark, nikto, gobuster`,
      `[network] Interface eth0 — isolated (no external access)`,
    ],
    dev: [
      `[system] Development environment`,
      `[tools] Loading: node v22.8, python 3.12, gcc 14.2, git 2.46`,
      `[tools] Container runtime: Docker 27.3 (rootless)`,
      `[network] DHCP: 172.16.0.3/24`,
      `[system] Filesystem: read-write, tmpfs: 1g`,
    ],
    private: [
      `[tor] Starting Tor daemon 0.4.8.12...`,
      `[tor] Circuit established: 🇺🇸 US → 🇫🇷 FR → 🇩🇪 DE`,
      `[vpn] WireGuard tunnel: connected (10.88.0.2)`,
      `[security] 🔒 Zero-log policy enforced`,
      `[security] Network mode: tor (all traffic anonymized)`,
      `[tools] tor-browser, signal, gpg, encrypted-notes`,
    ],
  };

  return [...base, ...(typeLogs[type] || typeLogs.general), `[init] Instance ready.`];
};
