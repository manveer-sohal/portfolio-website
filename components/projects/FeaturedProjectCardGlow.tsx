"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type FeaturedProjectCardGlowProps = {
  color: string;
};

/**
 * Title-colour highlight that loops just outside the featured media frame.
 * CSS ring (not SVG) so corner radius stays true on wide/tall cards.
 */
export function FeaturedProjectCardGlow({ color }: FeaturedProjectCardGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const target =
      (node.closest("[data-featured-glow]") as HTMLElement | null) ?? node;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOn(entry.isIntersecting);
      },
      {
        threshold: 0.4,
        rootMargin: "-10% 0px -10% 0px",
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("featured-card-glow", on && "is-on")}
      style={{ "--featured-glow-color": color } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="featured-card-glow__beam" />
    </div>
  );
}
