"use client";

import { useEffect, useState } from "react";

/** Subscribes to a CSS media query; safe under Strict Mode. */
export function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const sync = () => setMatches(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, [query]);

  return matches;
}

/** Desktop teal-rail breakpoint used across homepage scroll effects. */
export function useDesktopTealRails(): boolean {
  return useMatchMedia("(min-width: 900px)");
}

export function usePrefersReducedMotion(): boolean {
  return useMatchMedia("(prefers-reduced-motion: reduce)");
}
