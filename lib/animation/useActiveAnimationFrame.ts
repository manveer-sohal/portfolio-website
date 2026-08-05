"use client";

import { useEffect, useRef } from "react";

type UseActiveAnimationFrameOptions = {
  /** When false, no frames are scheduled. */
  active: boolean;
  /** Invoked once per animation frame while active and the tab is visible. */
  callback: (now: number) => void;
};

/**
 * Runs a single requestAnimationFrame loop while `active` is true.
 * Pauses when the document is hidden and resumes on visibilitychange.
 * Changing `callback` does not restart the loop (ref-stable).
 */
export function useActiveAnimationFrame({
  active,
  callback,
}: UseActiveAnimationFrameOptions): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    let running = true;

    const loop = (now: number) => {
      if (!running) return;
      if (document.visibilityState === "hidden") {
        raf = 0;
        return;
      }
      callbackRef.current(now);
      raf = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (!running || raf !== 0) return;
      if (document.visibilityState === "hidden") return;
      raf = window.requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (raf !== 0) {
          window.cancelAnimationFrame(raf);
          raf = 0;
        }
        return;
      }
      start();
    };

    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      running = false;
      if (raf !== 0) window.cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);
}
