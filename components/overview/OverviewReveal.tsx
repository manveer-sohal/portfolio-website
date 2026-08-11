"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type OverviewRevealProps = {
  children: ReactNode;
  className?: string;
};

/** Subtle opacity/translate reveal; respects prefers-reduced-motion. */
export function OverviewReveal({ children, className }: OverviewRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        className,
        "overview-item is-reveal",
        visible && "is-visible",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
