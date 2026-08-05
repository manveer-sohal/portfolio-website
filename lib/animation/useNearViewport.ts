"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True when `ref` intersects the viewport (with optional rootMargin so work
 * can begin shortly before the element is visible).
 */
export function useNearViewport(
  ref: RefObject<Element | null>,
  rootMargin = "25% 0px 25% 0px",
): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setNear(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
      },
      { root: null, rootMargin, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return near;
}
