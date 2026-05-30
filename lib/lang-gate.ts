/** Cookie used to remember that the first-visit language gate was answered. */
export const GATE_COOKIE = 'aman_gate_seen';

export function hasSeenGate(): boolean {
  if (typeof document === 'undefined') return true;
  return document.cookie.split('; ').some((c) => c.startsWith(`${GATE_COOKIE}=`));
}

export function markGateSeen(): void {
  if (typeof document === 'undefined') return;
  // One year, site-wide.
  document.cookie = `${GATE_COOKIE}=1; path=/; max-age=31536000; samesite=lax`;
}
