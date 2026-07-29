export type InstanceType = 'general' | 'cybersec' | 'dev' | 'private';

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
  data: string;
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

// ─── Instance Type Config ──────────────────────────────────────────────

export interface InstanceTypeMeta {
  color: string;
  label: string;
  border: string;
  icon: string;
  description: string;
}

export const InstanceSecurityConfig: Record<InstanceType, InstanceTypeMeta> = {
  'general': {
    color: 'border-zinc-700',
    label: 'General',
    border: 'border-zinc-700',
    icon: '📋',
    description: 'Productivity suite — spreadsheets, documents, presentations',
  },
  'cybersec': {
    color: 'border-red-600',
    label: 'Cybersec',
    border: 'border-red-600',
    icon: '🛡️',
    description: 'Offensive security toolkit — nmap, Metasploit, Burp Suite',
  },
  'dev': {
    color: 'border-cyan-500',
    label: 'Dev',
    border: 'border-cyan-500',
    icon: '💻',
    description: 'Development environment — code, terminal, containers',
  },
  'private': {
    color: 'border-purple-500',
    label: 'Private',
    border: 'border-purple-500',
    icon: '🔒',
    description: 'Anonymous browsing — Tor-routed, encrypted, zero-log',
  },
};

export const InstanceTooling: Record<InstanceType, string[]> = {
  'general': ['spreadsheets', 'presentations', 'documents', 'calculator'],
  'cybersec': ['nmap', 'metasploit', 'burpsuite', 'wireshark', 'nikto', 'terminal'],
  'dev': ['vscode', 'terminal', 'git', 'docker', 'node'],
  'private': ['tor-browser', 'signal', 'encrypted-notes', 'terminal'],
};

export const getDefaultSecurityPolicy = (type: InstanceType): SecurityPolicy => {
  switch (type) {
    case 'cybersec':
      return {
        network_mode: 'isolated',
        readonly_rootfs: true,
        capabilities_drop: ['ALL'],
        tmpfs_size: '512m',
        vpn_enabled: false,
        zero_log: true,
      };
    case 'private':
      return {
        network_mode: 'tor',
        readonly_rootfs: true,
        capabilities_drop: ['ALL'],
        tmpfs_size: '256m',
        vpn_enabled: true,
        zero_log: true,
      };
    case 'dev':
      return {
        network_mode: 'bridged',
        readonly_rootfs: false,
        capabilities_drop: [],
        tmpfs_size: '1g',
        vpn_enabled: false,
        zero_log: false,
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
