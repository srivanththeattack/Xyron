export type InstanceType = 'general' | 'red-team' | 'privacy';

export type InstanceStatus = 'booting' | 'running' | 'paused' | 'stopped' | 'error';

export interface SecurityPolicy {
  network_mode: 'bridged' | 'isolated' | 'tor';
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
