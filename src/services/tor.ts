import { TorCircuit, TorNode } from '../types/instance';

const nodes: TorNode[] = [
  { country: '🇺🇸 US', ip: '85.14.23.1', role: 'entry', latency_ms: 42 },
  { country: '🇫🇷 FR', ip: '92.45.67.3', role: 'middle', latency_ms: 78 },
  { country: '🇩🇪 DE', ip: '51.15.88.9', role: 'exit', latency_ms: 103 },
  { country: '🔒 Destination', ip: 'xxx.xxx.xxx.xxx', role: 'destination', latency_ms: 145 },
];

export const getTorCircuit = async (): Promise<TorCircuit> => {
  await new Promise(r => setTimeout(r, 300));
  return {
    enabled: true,
    nodes,
    circuit_id: `0x${Math.random().toString(16).slice(2, 10)}`,
    build_time_ms: 2340 + Math.floor(Math.random() * 500),
  };
};

export const getTorNodeLatencies = async (): Promise<number[]> => {
  return nodes.map(n => n.latency_ms + Math.floor(Math.random() * 20));
};
