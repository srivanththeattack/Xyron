/**
 * Xyron Snapshot Engine
 * Encrypts/decrypts instance state using Web Crypto API (AES-GCM)
 * and persists snapshots to localStorage.
 */

import { Snapshot, InstanceType } from '../types/instance';
import { ZERO_LOG_POLICY } from '../utils/sanitize';

const STORAGE_KEY = 'xyron-snapshots';
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

// Generate a random encryption key
async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

export async function importKey(base64: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return crypto.subtle.importKey('raw', raw.buffer as unknown as ArrayBuffer, { name: ALGORITHM, length: KEY_LENGTH }, false, ['encrypt', 'decrypt']);
}

// Encrypt data → base64-encoded ciphertext with IV prepended
export async function encryptData(plaintext: string, key?: CryptoKey): Promise<{ data: string; keyExport?: string }> {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const useKey = key || await generateKey();
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    useKey,
    enc.encode(plaintext) as unknown as ArrayBuffer
  );
  // Prepend IV to ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  const base64 = btoa(String.fromCharCode(...combined));
  return { data: base64, keyExport: key ? undefined : await exportKey(useKey) };
}

// Decrypt base64-encoded data (first 12 bytes = IV)
export async function decryptData(base64: string, key: CryptoKey): Promise<string> {
  const raw = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const iv = raw.slice(0, 12);
  const ciphertext = raw.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext as unknown as ArrayBuffer);
  return new TextDecoder().decode(decrypted);
}

// Get stored snapshots
export function getSnapshots(): Snapshot[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

// Save a new snapshot — returns snapshot + optional exported key
export async function saveSnapshot(
  name: string,
  instanceType: InstanceType,
  stateData: Record<string, unknown>,
  key?: CryptoKey
): Promise<{ snapshot: Snapshot; keyExport?: string }> {
  const json = JSON.stringify(stateData);
  const { data, keyExport } = await encryptData(json, key);

  const snapshot: Snapshot = {
    id: `snap-${Date.now().toString(36)}`,
    name,
    instance_type: instanceType,
    created_at: new Date().toISOString(),
    size_bytes: new Blob([data]).size,
    encrypted: true,
    data,
  };

  const snapshots = getSnapshots();
  snapshots.push(snapshot);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));

  if (!ZERO_LOG_POLICY) {
    console.log(`[Snapshot] Saved "${name}" (${snapshot.size_bytes} bytes encrypted)`);
  }

  return { snapshot, keyExport };
}

// Load and decrypt a snapshot
export async function loadSnapshot(snapshot: Snapshot, key: CryptoKey): Promise<Record<string, unknown>> {
  const decrypted = await decryptData(snapshot.data, key);
  return JSON.parse(decrypted);
}

// Delete a snapshot
export function deleteSnapshot(id: string): void {
  const snapshots = getSnapshots().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
}

// Store encryption key in sessionStorage (cleared on tab close)
const KEY_STORAGE = 'xyron-snapshot-key';

export function storeKeyInSession(key: string): void {
  sessionStorage.setItem(KEY_STORAGE, key);
}

export function getKeyFromSession(): string | null {
  return sessionStorage.getItem(KEY_STORAGE);
}
