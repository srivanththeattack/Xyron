/**
 * Xyron API Service Layer
 * In production, these call the Vercel serverless backend.
 * For now, they provide realistic stubs that simulate the full lifecycle.
 */

import { InstanceType, InstanceConfig, getDefaultSecurityPolicy, InstanceTooling } from '../types/instance';

// Simulated instance store (in production this lives on the backend)
const instanceStore = new Map<string, InstanceConfig>();

const generateId = (): string => `xyron-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// POST /api/instances
export const apiSpawnInstance = async (type: InstanceType): Promise<InstanceConfig> => {
  await delay(1200); // Simulate container boot time

  const instance: InstanceConfig = {
    instance_id: generateId(),
    instance_type: type,
    security_policy: getDefaultSecurityPolicy(type),
    tools: InstanceTooling[type],
    persistence: { enabled: false },
    status: 'running',
    created_at: new Date().toISOString(),
  };

  instanceStore.set(instance.instance_id, instance);
  return instance;
};

// GET /api/instances/:id
export const apiGetInstance = async (id: string): Promise<InstanceConfig | null> => {
  await delay(100);
  return instanceStore.get(id) ?? null;
};

// DELETE /api/instances/:id
export const apiStopInstance = async (id: string): Promise<void> => {
  await delay(500);
  const instance = instanceStore.get(id);
  if (instance) {
    instance.status = 'stopped';
  }
};

// POST /api/instances/:id/pause
export const apiPauseInstance = async (id: string): Promise<void> => {
  await delay(300);
  const instance = instanceStore.get(id);
  if (instance) {
    instance.status = 'paused';
  }
};

// POST /api/instances/:id/resume
export const apiResumeInstance = async (id: string): Promise<void> => {
  await delay(300);
  const instance = instanceStore.get(id);
  if (instance) {
    instance.status = 'running';
  }
};

// GET /api/instances/:id/logs
export const apiGetInstanceLogs = async (_id: string): Promise<string[]> => {
  await delay(200);
  return [
    `[${new Date().toISOString()}] Container orchestrated successfully`,
    `[${new Date().toISOString()}] Network namespace: isolated`,
    `[${new Date().toISOString()}] Security policy applied: read-only rootfs, capabilities dropped`,
    `[${new Date().toISOString()}] Instance ready ✅`,
  ];
};

// POST /api/chat/send (for chat platform)
export const apiSendChatMessage = async (_channel: string, _message: string): Promise<{ id: string; timestamp: string }> => {
  await delay(150);
  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
};

// GET /api/vpn/status
export const apiGetVpnStatus = async (): Promise<{ connected: boolean; ip: string; protocol: string }> => {
  await delay(300);
  return {
    connected: true,
    ip: '10.88.0.2',
    protocol: 'wireguard',
  };
};

// POST /api/vpn/connect
export const apiVpnConnect = async (): Promise<{ status: string }> => {
  await delay(2000);
  return { status: 'connected' };
};

// POST /api/vpn/disconnect
export const apiVpnDisconnect = async (): Promise<{ status: string }> => {
  await delay(500);
  return { status: 'disconnected' };
};

// GET /api/tor/status
export const apiGetTorStatus = async (): Promise<{ enabled: boolean; circuit: string }> => {
  await delay(400);
  return {
    enabled: true,
    circuit: 'US → FR → DE → exit',
  };
};
