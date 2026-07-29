export type InstanceType = 'general' | 'red-team' | 'privacy';
export type InstanceStatus = 'booting' | 'running' | 'paused' | 'stopped' | 'error';
export type NetworkMode = 'bridged' | 'isolated' | 'tor';

export interface SecurityPolicy {
  network_mode: NetworkMode;
  readonly_rootfs: boolean;
  capabilities_drop: string[];
  tmpfs_size: string;
  vpn_enabled: boolean;
  zero_log: boolean;
}

export interface InstanceConfig {
  instance_id: string;
  instance_type: InstanceType;
  security_policy: SecurityPolicy;
  tools: string[];
  persistence: { enabled: boolean };
  status: InstanceStatus;
  created_at: string;
}

export interface ContainerStats {
  cpu_usage: number;
  memory_usage: number;
  memory_limit: number;
  uptime_seconds: number;
  network_rx: number;
  network_tx: number;
}

export interface Snapshot {
  id: string;
  name: string;
  instance_type: InstanceType;
  created_at: string;
  size_bytes: number;
  encrypted: boolean;
  data: string; // base64-encoded encrypted blob
}

export interface VpnStatus {
  connected: boolean;
  ip: string;
  protocol: 'wireguard';
  handshake_seconds: number;
  transfer_rx: number;
  transfer_tx: number;
  endpoint: string;
}

export interface TorCircuit {
  enabled: boolean;
  nodes: TorNode[];
  circuit_id: string;
  build_time_ms: number;
}

export interface TorNode {
  country: string;
  ip: string;
  role: 'entry' | 'middle' | 'exit' | 'destination';
  latency_ms: number;
}

export const InstanceSecurityConfig: Record<InstanceType, { color: string; label: string; border: string }> = {
  'general': { color: 'border-zinc-700', label: 'General', border: 'border-zinc-700' },
  'red-team': { color: 'border-red-600', label: 'Red Team', border: 'border-red-600' },
  'privacy': { color: 'border-blue-500', label: 'Privacy', border: 'border-blue-500' },
};

export const InstanceTooling: Record<InstanceType, string[]> = {
  'general': ['browser', 'terminal', 'files'],
  'red-team': ['nmap', 'metasploit', 'burpsuite', 'terminal'],
  'privacy': ['tor-browser', 'signal', 'terminal'],
};

export const getDefaultSecurityPolicy = (type: InstanceType): SecurityPolicy => {
  switch (type) {
    case 'red-team':
      return {
        network_mode: 'isolated',
        readonly_rootfs: true,
        capabilities_drop: ['ALL'],
        tmpfs_size: '256m',
        vpn_enabled: false,
        zero_log: true,
      };
    case 'privacy':
      return {
        network_mode: 'tor',
        readonly_rootfs: true,
        capabilities_drop: ['ALL'],
        tmpfs_size: '128m',
        vpn_enabled: true,
        zero_log: true,
      };
    case 'general':
    default:
      return {
        network_mode: 'bridged',
        readonly_rootfs: false,
        capabilities_drop: [],
        tmpfs_size: '512m',
        vpn_enabled: false,
        zero_log: false,
      };
  }
};
