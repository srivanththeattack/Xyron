import { VpnStatus } from '../types/instance';

let connected = false;
let connectTime = 0;

export const getVpnStatus = async (): Promise<VpnStatus> => {
  await new Promise(r => setTimeout(r, 200));
  if (!connected) {
    return {
      connected: false,
      ip: '0.0.0.0',
      protocol: 'wireguard',
      handshake_seconds: 0,
      transfer_rx: 0,
      transfer_tx: 0,
      endpoint: 'wg.xyron.io:51820',
    };
  }
  const elapsed = (Date.now() - connectTime) / 1000;
  return {
    connected: true,
    ip: '10.88.0.2',
    protocol: 'wireguard',
    handshake_seconds: elapsed,
    transfer_rx: Math.floor(Math.random() * 50 * 1024 * 1024 + elapsed * 1024),
    transfer_tx: Math.floor(Math.random() * 20 * 1024 * 1024 + elapsed * 512),
    endpoint: 'wg.xyron.io:51820',
  };
};

export const connectVpn = async (): Promise<void> => {
  await new Promise(r => setTimeout(r, 2500)); // Simulate handshake delay
  connected = true;
  connectTime = Date.now();
};

export const disconnectVpn = async (): Promise<void> => {
  await new Promise(r => setTimeout(r, 500));
  connected = false;
  connectTime = 0;
};

export const isVpnConnected = (): boolean => connected;
