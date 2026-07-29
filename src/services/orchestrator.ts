/**
 * Xyron Orchestrator Engine
 * Manages the full lifecycle of ephemeral containers with security isolation.
 * Bridges the UI layer with the backend API.
 */

import { InstanceType, InstanceConfig, getDefaultSecurityPolicy } from '../types/instance';
import {
  apiSpawnInstance,
  apiStopInstance,
  apiPauseInstance,
  apiResumeInstance,
  apiGetInstanceLogs,
  apiGetVpnStatus,
  apiVpnConnect,
  apiVpnDisconnect,
  apiGetTorStatus,
} from './api';

// ─── Container Lifecycle ───────────────────────────────────────────────

export const spawnInstance = async (type: InstanceType): Promise<InstanceConfig> => {
  const policy = getDefaultSecurityPolicy(type);
  console.log(`[Orchestrator] Spawning ${type} instance with policy:`, policy);

  // Enforce zero-log for privacy/red-team instances
  if (policy.zero_log) {
    console.log('[Orchestrator] Zero-log policy active — no session data will persist');
  }

  // Connect VPN if enabled
  if (policy.vpn_enabled) {
    console.log('[Orchestrator] WireGuard VPN connect requested');
    const vpnStatus = await apiVpnConnect();
    console.log(`[Orchestrator] VPN ${vpnStatus.status}`);
  }

  // Route through Tor if required
  if (policy.network_mode === 'tor') {
    console.log('[Orchestrator] Tor routing enabled for privacy instance');
    const torStatus = await apiGetTorStatus();
    console.log(`[Orchestrator] Tor circuit: ${torStatus.circuit}`);
  }

  return await apiSpawnInstance(type);
};

export const stopInstance = async (id: string): Promise<void> => {
  console.log(`[Orchestrator] Stopping instance ${id}`);
  await apiStopInstance(id);
};

export const pauseInstance = async (id: string): Promise<void> => {
  console.log(`[Orchestrator] Pausing instance ${id}`);
  await apiPauseInstance(id);
};

export const resumeInstance = async (id: string): Promise<void> => {
  console.log(`[Orchestrator] Resuming instance ${id}`);
  await apiResumeInstance(id);
};

export const getInstanceLogs = async (id: string): Promise<string[]> => {
  return await apiGetInstanceLogs(id);
};

// ─── VPN ───────────────────────────────────────────────────────────────

export const getVpnStatus = async () => {
  return await apiGetVpnStatus();
};

export const connectVpn = async () => {
  return await apiVpnConnect();
};

export const disconnectVpn = async () => {
  return await apiVpnDisconnect();
};

// ─── Tor ───────────────────────────────────────────────────────────────

export const getTorStatus = async () => {
  return await apiGetTorStatus();
};
