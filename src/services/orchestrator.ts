import { InstanceType, InstanceConfig, getDefaultSecurityPolicy } from '../types/instance';
import { apiSpawnInstance, apiStopInstance, apiPauseInstance, apiResumeInstance, apiGetInstanceLogs } from './api';
import { startStatsTracking, stopStatsTracking, getBootLogs } from './container';
import { connectVpn, disconnectVpn } from './vpn';

// ─── Container Lifecycle ───────────────────────────────────────────────

export const spawnInstance = async (type: InstanceType): Promise<InstanceConfig> => {
  const policy = getDefaultSecurityPolicy(type);
  console.log(`[Orchestrator] Spawning ${type} instance`);
  console.log(`[Orchestrator] Security policy:`, policy);

  // Boot sequence simulation
  const bootLogs = getBootLogs(type);
  for (const line of bootLogs) {
    console.log(`[Boot] ${line}`);
    await new Promise(r => setTimeout(r, 100));
  }

  // Enforce zero-log
  if (policy.zero_log) {
    console.log('[Orchestrator] Zero-log policy active — no session data will persist');
  }

  // VPN for privacy instances
  if (policy.vpn_enabled) {
    console.log('[Orchestrator] Connecting WireGuard VPN...');
    await connectVpn();
    console.log('[Orchestrator] VPN connected');
  }

  const instance = await apiSpawnInstance(type);
  startStatsTracking(instance.instance_id);
  return instance;
};

export const stopInstance = async (id: string): Promise<void> => {
  console.log(`[Orchestrator] Stopping instance ${id}`);
  stopStatsTracking(id);
  await disconnectVpn();
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

export { getVpnStatus, connectVpn, disconnectVpn } from './vpn';

// ─── Tor ───────────────────────────────────────────────────────────────

export { getTorCircuit } from './tor';

// ─── Container Stats ───────────────────────────────────────────────────

export { getContainerStats } from './container';
