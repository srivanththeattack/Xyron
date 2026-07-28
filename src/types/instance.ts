export type InstanceType = 'general' | 'red-team' | 'privacy';

export const InstanceSecurityConfig: Record<InstanceType, { color: string; label: string }> = {
  'general': { color: 'border-zinc-700', label: 'General' },
  'red-team': { color: 'border-red-600', label: 'Red Team' },
  'privacy': { color: 'border-blue-500', label: 'Privacy' },
};
