import { InstanceType, InstanceConfig, getDefaultSecurityPolicy, InstanceTooling } from '../types/instance';

const instanceStore = new Map<string, InstanceConfig>();

const generateId = (): string => `xyron-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiSpawnInstance = async (type: InstanceType): Promise<InstanceConfig> => {
  await delay(800);

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

export const apiGetInstance = async (id: string): Promise<InstanceConfig | null> => {
  await delay(100);
  return instanceStore.get(id) ?? null;
};

export const apiStopInstance = async (id: string): Promise<void> => {
  await delay(500);
  const instance = instanceStore.get(id);
  if (instance) instance.status = 'stopped';
};

export const apiPauseInstance = async (id: string): Promise<void> => {
  await delay(300);
  const instance = instanceStore.get(id);
  if (instance) instance.status = 'paused';
};

export const apiResumeInstance = async (id: string): Promise<void> => {
  await delay(300);
  const instance = instanceStore.get(id);
  if (instance) instance.status = 'running';
};

export const apiGetInstanceLogs = async (_id: string): Promise<string[]> => {
  await delay(200);
  return [
    `[${new Date().toISOString()}] Container orchestrated successfully`,
    `[${new Date().toISOString()}] Security policy applied`,
    `[${new Date().toISOString()}] Network namespace configured`,
    `[${new Date().toISOString()}] Instance ready ✅`,
  ];
};

export const apiSendChatMessage = async (_channel: string, _message: string): Promise<{ id: string; timestamp: string }> => {
  await delay(150);
  return { id: generateId(), timestamp: new Date().toISOString() };
};
