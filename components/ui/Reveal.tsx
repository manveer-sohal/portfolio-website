"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stronger entrance for featured project blocks */
  variant?: "default" | "feature";
  /** Optional stagger delay in ms after becoming visible */
  delayMs?: number;
};

export function Reveal({
  children,
  className,
  variant = "default",
  delayMs = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      node.classList.add("is-visible");
      return;
    }

    if (delayMs > 0) {
      node.style.setProperty("--reveal-delay", `${delayMs}ms`);
    }

    // Featured blocks: trigger when the project title row is in view,
    // not when a large share of the tall card intersects.
    const trigger =
      variant === "feature"
        ? (node.querySelector("[data-reveal-trigger]") as HTMLElement | null) ??
          node
        : node;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      variant === "feature"
        ? { threshold: 0.55, rootMargin: "0px 0px -12% 0px" }
        : { threshold: 0.12 },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [delayMs, variant]);

  return (
    <div
      ref={ref}
      className={cn(
        "reveal",
        variant === "feature" && "reveal--feature",
        className,
      )}
    >
      {children}
    </div>
  );
}
