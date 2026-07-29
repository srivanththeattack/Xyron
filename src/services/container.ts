import { ContainerStats, InstanceType } from '../types/instance';

// Simulated container stats generator
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

  // Simulate realistic-looking stats with some variation
  const baseCpu = type === 'general' ? 12 : type === 'red-team' ? 34 : 18;
  const baseMem = type === 'general' ? 128 : type === 'red-team' ? 384 : 192;

  await new Promise(r => setTimeout(r, 50)); // Simulate API latency

  return {
    cpu_usage: Math.min(100, baseCpu + Math.random() * 20),
    memory_usage: Math.min(baseMem * 2, baseMem + Math.random() * baseMem * 0.5),
    memory_limit: baseMem * 4,
    uptime_seconds: uptime,
    network_rx: Math.floor(Math.random() * 1024 * 1024),
    network_tx: Math.floor(Math.random() * 512 * 1024),
  };
};

// Simulated boot sequence logs
export const getBootLogs = (type: InstanceType): string[] => {
  const base = [
    `[kernel] Xyron micro-kernel v0.1.0 booting...`,
    `[kernel] CPU: WebAssembly (64-bit, 4 vCPUs)`,
    `[kernel] Memory: 2GiB available`,
    `[init] Starting init system...`,
  ];

  const typeSpecific = type === 'privacy'
    ? [
        `[tor] Starting Tor daemon...`,
        `[tor] Circuit established: US → FR → DE → exit`,
        `[vpn] WireGuard tunnel: connected (10.88.0.2)`,
        `[security] Zero-log policy enforced`,
        `[security] Network mode: tor (isolated)`,
      ]
    : type === 'red-team'
    ? [
        `[security] Capabilities dropped: ALL`,
        `[security] Root filesystem: read-only`,
        `[security] Network mode: isolated`,
        `[security] Zero-log policy enforced`,
        `[tools] Loading toolchain: nmap, metasploit, burpsuite`,
      ]
    : [
        `[network] DHCP: 172.16.0.2/24`,
        `[system] Filesystem: read-write (ephemeral overlay)`,
        `[tools] Loading standard utilities...`,
      ];

  return [...base, ...typeSpecific, `[init] Instance ready.`];
};
