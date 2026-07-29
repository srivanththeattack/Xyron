import React, { useState, useEffect } from 'react';
import { ContainerStats, InstanceType } from '../types/instance';
import { getContainerStats } from '../services/container';

interface ContainerStatsPanelProps {
  instanceId: string | null;
  instanceType: InstanceType;
}

const ContainerStatsPanel: React.FC<ContainerStatsPanelProps> = ({ instanceId, instanceType }) => {
  const [stats, setStats] = useState<ContainerStats | null>(null);

  useEffect(() => {
    if (!instanceId) return;
    const fetchStats = async () => {
      const s = await getContainerStats(instanceId, instanceType);
      setStats(s);
    };
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, [instanceId, instanceType]);

  if (!instanceId || !stats) {
    return (
      <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 p-4 text-sm">
        <h3 className="text-zinc-400 font-semibold mb-3 flex items-center gap-2">
          <span>📊</span> Container Stats
        </h3>
        <p className="text-xs text-zinc-600">Waiting for instance...</p>
      </div>
    );
  }

  const cpuPercent = stats.cpu_usage.toFixed(0);
  const memPercent = ((stats.memory_usage / stats.memory_limit) * 100).toFixed(0);
  const uptime = stats.uptime_seconds < 60
    ? `${stats.uptime_seconds.toFixed(0)}s`
    : `${(stats.uptime_seconds / 60).toFixed(1)}m`;

  const formatBytes = (b: number) => {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  const bar = (percent: number) => (
    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(100, percent)}%`,
          backgroundColor: percent > 80 ? '#ef4444' : percent > 50 ? '#eab308' : '#22c55e',
        }}
      />
    </div>
  );

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 p-4 text-sm">
      <h3 className="text-zinc-400 font-semibold mb-3 flex items-center gap-2">
        <span>📊</span> Container Stats
      </h3>

      <div className="space-y-2 text-xs">
        <div>
          <div className="flex justify-between text-zinc-500">
            <span>CPU</span>
            <span className="text-zinc-300">{cpuPercent}%</span>
          </div>
          {bar(parseFloat(cpuPercent))}
        </div>

        <div>
          <div className="flex justify-between text-zinc-500">
            <span>Memory</span>
            <span className="text-zinc-300">{formatBytes(stats.memory_usage)} / {formatBytes(stats.memory_limit)}</span>
          </div>
          {bar(parseFloat(memPercent))}
        </div>

        <div className="flex justify-between text-zinc-500 pt-1 border-t border-zinc-800">
          <span>Uptime</span>
          <span className="text-zinc-300">{uptime}</span>
        </div>
        <div className="flex justify-between text-zinc-500">
          <span>Network RX</span>
          <span className="text-zinc-300">{formatBytes(stats.network_rx)}</span>
        </div>
        <div className="flex justify-between text-zinc-500">
          <span>Network TX</span>
          <span className="text-zinc-300">{formatBytes(stats.network_tx)}</span>
        </div>
      </div>
    </div>
  );
};

export default ContainerStatsPanel;
