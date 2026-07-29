import React, { useState, useEffect } from 'react';
import { TorCircuit as TorCircuitType } from '../types/instance';
import { getTorCircuit } from '../services/tor';

const TorCircuitView: React.FC = () => {
  const [circuit, setCircuit] = useState<TorCircuitType | null>(null);

  useEffect(() => {
    const fetchCircuit = async () => {
      const c = await getTorCircuit();
      setCircuit(c);
    };
    fetchCircuit();
    const interval = setInterval(fetchCircuit, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!circuit) {
    return (
      <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 p-4 text-sm">
        <h3 className="text-zinc-400 font-semibold mb-3 flex items-center gap-2">
          <span>🧅</span> Tor Circuit
        </h3>
        <p className="text-xs text-zinc-600">Loading circuit...</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 p-4 text-sm">
      <h3 className="text-zinc-400 font-semibold mb-3 flex items-center gap-2">
        <span>🧅</span> Tor Circuit
      </h3>

      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${circuit.enabled ? 'bg-green-500' : 'bg-zinc-600'}`} />
        <span className="text-xs text-zinc-400">
          Circuit {circuit.circuit_id} · Built in {(circuit.build_time_ms / 1000).toFixed(1)}s
        </span>
      </div>

      <div className="space-y-1">
        {circuit.nodes.map((node, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-3 bg-zinc-800/50 rounded-lg px-3 py-2">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                ${node.role === 'entry' ? 'bg-blue-900/50 text-blue-400' : ''}
                ${node.role === 'middle' ? 'bg-yellow-900/50 text-yellow-400' : ''}
                ${node.role === 'exit' ? 'bg-red-900/50 text-red-400' : ''}
                ${node.role === 'destination' ? 'bg-green-900/50 text-green-400' : ''}
              `}>
                {node.role === 'entry' ? 'E' : node.role === 'middle' ? 'M' : node.role === 'exit' ? 'X' : 'D'}
              </div>
              <div className="flex-1">
                <p className="text-zinc-300 text-xs">{node.country}</p>
                <p className="text-zinc-600 text-[10px]">{node.ip}</p>
              </div>
              <span className="text-zinc-500 text-[10px]">{node.latency_ms}ms</span>
            </div>
            {i < circuit.nodes.length - 1 && (
              <div className="flex justify-center -my-1">
                <span className="text-zinc-700 text-xs">⬇</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TorCircuitView;
