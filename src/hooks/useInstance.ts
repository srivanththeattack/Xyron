import { useState, useCallback } from 'react';
import { InstanceType, InstanceConfig, InstanceStatus, InstanceSecurityConfig, getDefaultSecurityPolicy } from '../types/instance';
import { spawnInstance, stopInstance, pauseInstance, resumeInstance, getInstanceLogs } from '../services/orchestrator';

export function useInstance(initialType: InstanceType = 'general') {
  const [type, setType] = useState<InstanceType>(initialType);
  const [status, setStatus] = useState<InstanceStatus>('stopped');
  const [logs, setLogs] = useState<string[]>([]);
  const [config, setConfig] = useState<InstanceConfig | null>(null);

  const launch = useCallback(async (instanceType: InstanceType) => {
    setType(instanceType);
    setStatus('booting');
    try {
      const instance = await spawnInstance(instanceType);
      setConfig(instance);
      setStatus('running');
      const initialLogs = await getInstanceLogs(instance.instance_id);
      setLogs(initialLogs);
    } catch {
      setStatus('error');
    }
  }, []);

  const stop = useCallback(async () => {
    if (!config) return;
    setStatus('stopped');
    await stopInstance(config.instance_id);
  }, [config]);

  const pause = useCallback(async () => {
    if (!config) return;
    setStatus('paused');
    await pauseInstance(config.instance_id);
  }, [config]);

  const resume = useCallback(async () => {
    if (!config) return;
    setStatus('running');
    await resumeInstance(config.instance_id);
  }, [config]);

  const securityConfig = InstanceSecurityConfig[type];
  const policy = getDefaultSecurityPolicy(type);

  return {
    type,
    status,
    logs,
    config,
    securityConfig,
    policy,
    launch,
    stop,
    pause,
    resume,
  };
}
