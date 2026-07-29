import React, { useState, useEffect } from 'react';
import { VpnStatus } from '../types/instance';
import { getVpnStatus, connectVpn, disconnectVpn } from '../services/vpn';

const VPNPanel: React.FC = () => {
  const [status, setStatus] = useState<VpnStatus | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const s = await getVpnStatus();
      setStatus(s);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    if (status?.connected) {
      setConnecting(true);
      await disconnectVpn();
      setConnecting(false);
    } else {
      setConnecting(true);
      await connectVpn();
      setConnecting(false);
    }
    setStatus(await getVpnStatus());
  };

  const formatBytes = (b: number) => {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 p-4 text-sm">
      <h3 className="text-zinc-400 font-semibold mb-3 flex items-center gap-2">
        <span>🔐</span> WireGuard VPN
      </h3>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status?.connected ? 'bg-green-500' : 'bg-zinc-600'}`} />
          <span className="text-zinc-300 text-xs">
            {connecting ? 'Connecting...' : status?.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <button
          onClick={handleToggle}
          disabled={connecting}
          className={`px-4 py-1.5 rounded-lg text-xs transition font-medium ${
            status?.connected
              ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
              : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
          } disabled:opacity-40`}
        >
          {connecting ? '...' : status?.connected ? 'Disconnect' : 'Connect'}
        </button>
      </div>

      {status?.connected && (
        <div className="space-y-1 text-xs text-zinc-500">
          <div className="flex justify-between"><span>Endpoint</span><span className="text-zinc-300">{status.endpoint}</span></div>
          <div className="flex justify-between"><span>IP</span><span className="text-zinc-300">{status.ip}</span></div>
          <div className="flex justify-between"><span>Handshake</span><span className="text-zinc-300">{status.handshake_seconds.toFixed(0)}s ago</span></div>
          <div className="flex justify-between"><span>Received</span><span className="text-zinc-300">{formatBytes(status.transfer_rx)}</span></div>
          <div className="flex justify-between"><span>Sent</span><span className="text-zinc-300">{formatBytes(status.transfer_tx)}</span></div>
        </div>
      )}

      {!status?.connected && (
        <p className="text-xs text-zinc-600">Connect to route traffic through the encrypted tunnel.</p>
      )}
    </div>
  );
};

export default VPNPanel;
