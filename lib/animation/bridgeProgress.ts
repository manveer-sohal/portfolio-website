type BridgeProgressListener = (progress: number) => void;

let bridgeProgress = 0;
const listeners = new Set<BridgeProgressListener>();

/** Current featured→experience bridge draw progress (0–1). */
export function getBridgeProgress(): number {
  return bridgeProgress;
}

/**
 * Publish bridge progress for homepage ExperienceTimeline tip handoff.
 * Replaces per-frame dataset polling.
 */
export function setBridgeProgress(progress: number): void {
  const next = Math.min(1, Math.max(0, progress));
  if (next === bridgeProgress) return;
  bridgeProgress = next;
  listeners.forEach((listener) => listener(next));
}

export function subscribeBridgeProgress(
  listener: BridgeProgressListener,
): () => void {
  listeners.add(listener);
  listener(bridgeProgress);
  return () => {
    listeners.delete(listener);
  };
}
