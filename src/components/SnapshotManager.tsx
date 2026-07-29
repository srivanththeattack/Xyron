import React, { useState, useEffect, useCallback } from 'react';
import { InstanceType } from '../types/instance';
import { getSnapshots, saveSnapshot, loadSnapshot, deleteSnapshot, importKey, getKeyFromSession, storeKeyInSession } from '../services/snapshot';

interface SnapshotManagerProps {
  instanceType: InstanceType;
  instanceId: string | null;
}

const SnapshotManager: React.FC<SnapshotManagerProps> = ({ instanceType, instanceId }) => {
  const [snapshots, setSnapshots] = useState(getSnapshots());
  const [snapshotName, setSnapshotName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setSnapshots(getSnapshots());
  }, []);

  const refresh = useCallback(() => {
    setSnapshots(getSnapshots());
  }, []);

  const handleSave = async () => {
    const name = snapshotName.trim() || `Snapshot ${new Date().toLocaleString()}`;
    setSaving(true);
    setMessage('');
    try {
      const keyStr = getKeyFromSession();
      const key = keyStr ? await importKey(keyStr) : undefined;
      const state = {
        instance_type: instanceType,
        instance_id: instanceId,
        saved_at: new Date().toISOString(),
        tools: [],
      };
      const result = await saveSnapshot(name, instanceType, state, key);
      const { snapshot, keyExport: exportedKey } = result;
      if (exportedKey) {
        storeKeyInSession(exportedKey);
      }
      setMessage(`✅ Snapshot "${name}" saved (${snapshot.size_bytes} bytes encrypted)`);
      setSnapshotName('');
      refresh();
    } catch (err) {
      setMessage(`❌ Save failed: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async (snap: typeof snapshots[0]) => {
    setLoading(snap.id);
    setMessage('');
    try {
      const keyStr = getKeyFromSession();
      if (!keyStr) {
        setMessage('❌ No encryption key found in session. Snapshots are encrypted — this session cannot decrypt them.');
        return;
      }
      const key = await importKey(keyStr);
      const data = await loadSnapshot(snap, key);
      setMessage(`✅ Loaded snapshot "${snap.name}" (type: ${data.instance_type})`);
    } catch {
      setMessage('❌ Failed to decrypt snapshot. Key may have changed.');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    deleteSnapshot(id);
    setMessage(`🗑️ Deleted "${name}"`);
    refresh();
  };

  const snapshotsForType = snapshots.filter(s => s.instance_type === instanceType);

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 p-4 text-sm">
      <h3 className="text-zinc-400 font-semibold mb-3 flex items-center gap-2">
        <span>💾</span> Snapshot Engine
      </h3>

      {/* Save */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={snapshotName}
          onChange={e => setSnapshotName(e.target.value)}
          placeholder="Snapshot name..."
          className="flex-1 bg-zinc-800 text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700 text-xs focus:outline-none focus:border-zinc-500"
        />
        <button
          onClick={handleSave}
          disabled={saving || !instanceId}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs transition disabled:opacity-40"
        >
          {saving ? 'Encrypting...' : 'Save'}
        </button>
      </div>

      {/* List */}
      {snapshotsForType.length === 0 ? (
        <p className="text-zinc-600 text-xs">No snapshots saved yet.</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {snapshotsForType.map(snap => (
            <div key={snap.id} className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="text-zinc-300 text-xs truncate">{snap.name}</p>
                <p className="text-zinc-600 text-[10px]">
                  {new Date(snap.created_at).toLocaleDateString()} · {(snap.size_bytes / 1024).toFixed(1)}KB
                </p>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => handleLoad(snap)}
                  disabled={loading === snap.id}
                  className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded text-[10px] transition"
                >
                  {loading === snap.id ? '...' : 'Load'}
                </button>
                <button
                  onClick={() => handleDelete(snap.id, snap.name)}
                  className="px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-[10px] transition"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {message && (
        <p className="mt-2 text-xs text-zinc-500 break-words">{message}</p>
      )}
    </div>
  );
};

export default SnapshotManager;
