"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

type ProjectsExperienceBridgeProps = {
  children: ReactNode;
};

/**
 * Continues the featured teal rail into Experience with a scroll-drawn
 * path and a tip arrow that tracks along the stroke.
 */
export function ProjectsExperienceBridge({
  children,
}: ProjectsExperienceBridgeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [path, setPath] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const [tip, setTip] = useState({ x: 0, y: 0, angle: 0 });

  const drawProgress = useMotionValue(0);
  const opacity = useTransform(drawProgress, [0, 0.01], [0, 1]);
  const tipOpacity = useTransform(drawProgress, (p) => (p > 0.02 ? 1 : 0));

  const updateTip = (progress: number) => {
    const el = pathRef.current;
    if (!el || progress <= 0.001) {
      setTip({ x: 0, y: 0, angle: 0 });
      return;
    }
    const len = el.getTotalLength();
    const at = Math.min(len, Math.max(0, progress * len));
    const point = el.getPointAtLength(at);
    const prev = el.getPointAtLength(Math.max(0, at - 2));
    const angle =
      (Math.atan2(point.y - prev.y, point.x - prev.x) * 180) / Math.PI;
    setTip({ x: point.x, y: point.y, angle });
  };

  useMotionValueEvent(drawProgress, "change", updateTip);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = () => {
      if (window.matchMedia("(max-width: 899px)").matches) {
        setReady(false);
        setPath("");
        drawProgress.set(0);
        return;
      }

      const trackEl = wrap.querySelector(
        ".featured-rail__track",
      ) as HTMLElement | null;
      const endEl = wrap.querySelector(
        ".experience-timeline__row .experience-timeline__dot",
      ) as HTMLElement | null;
      const railEl = wrap.querySelector(
        ".experience-timeline__rail",
      ) as HTMLElement | null;
      const experience = wrap.querySelector("#experience");
      const eyebrow = experience?.querySelector(
        "[data-featured-eyebrow]",
      ) as HTMLElement | null;

      if (!trackEl || !endEl) {
        setReady(false);
        return;
      }

      const wrapRect = wrap.getBoundingClientRect();
      const trackRect = trackEl.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();
      const railRect = railEl?.getBoundingClientRect();

      const startX = trackRect.left + trackRect.width / 2 - wrapRect.left;
      const startY = trackRect.bottom - wrapRect.top;

      const endX = railRect
        ? railRect.left + railRect.width / 2 - wrapRect.left
        : endRect.left + endRect.width / 2 - wrapRect.left;
      const endY = endRect.top + endRect.height / 2 - wrapRect.top;

      const eyebrowTop = eyebrow
        ? eyebrow.getBoundingClientRect().top - wrapRect.top
        : startY + 24;
      const topY = Math.min(eyebrowTop - 14, endY - 48);
      const turnY = Math.max(startY + 12, topY);
      const r = Math.min(56, Math.max(36, (startX - endX) * 0.12));
      const joinY = startY - 10;

      const d = [
        `M ${startX} ${joinY}`,
        `L ${startX} ${turnY - r}`,
        `C ${startX} ${turnY - r * 0.35}, ${startX - r * 0.35} ${turnY}, ${startX - r} ${turnY}`,
        `L ${endX + r} ${turnY}`,
        `C ${endX + r * 0.35} ${turnY}, ${endX} ${turnY + r * 0.35}, ${endX} ${turnY + r}`,
        `L ${endX} ${endY}`,
      ].join(" ");

      setPath(d);
      setSize({
        w: Math.max(Math.round(wrapRect.width), 1),
        h: Math.max(Math.round(wrapRect.height), 1),
      });
      setReady(true);
      requestAnimationFrame(() => updateTip(drawProgress.get()));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 150);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, [drawProgress]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let raf = 0;
    const sync = () => {
      const fill = wrap.querySelector(
        ".featured-rail__fill",
      ) as HTMLElement | null;
      const track = wrap.querySelector(
        ".featured-rail__track",
      ) as HTMLElement | null;
      const endEl = wrap.querySelector(
        ".experience-timeline__row .experience-timeline__dot",
      ) as HTMLElement | null;

      if (
        !fill ||
        !track ||
        !endEl ||
        window.matchMedia("(max-width: 899px)").matches
      ) {
        drawProgress.set(0);
        raf = window.requestAnimationFrame(sync);
        return;
      }

      const vh = window.innerHeight;
      const fillH = fill.getBoundingClientRect().height;
      const trackRect = track.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();
      const trackBottom = trackRect.bottom;
      const endMid = endRect.top + endRect.height / 2;

      // Already past this connector (reload mid-page, or scrolled back up from below)
      if (endMid < vh * 0.48 || trackBottom < vh * 0.12) {
        drawProgress.set(1);
        raf = window.requestAnimationFrame(sync);
        return;
      }

      const fillComplete = trackRect.height > 0 && fillH >= trackRect.height - 4;
      if (!fillComplete) {
        drawProgress.set(0);
        raf = window.requestAnimationFrame(sync);
        return;
      }

      // Draw as the track tip moves up through the viewport
      const startLine = vh * 0.58;
      const endLine = vh * 0.36;
      const p = Math.min(
        1,
        Math.max(0, (startLine - trackBottom) / (startLine - endLine)),
      );
      drawProgress.set(p);

      raf = window.requestAnimationFrame(sync);
    };

    raf = window.requestAnimationFrame(sync);
    return () => window.cancelAnimationFrame(raf);
  }, [drawProgress]);

  return (
    <div ref={wrapRef} className="projects-experience-bridge">
      {children}
      {ready && path && size.w > 0 ? (
        <svg
          className="projects-experience-bridge__svg"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="xMinYMin meet"
          aria-hidden="true"
        >
          <motion.path
            ref={pathRef}
            d={path}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              pathLength: drawProgress,
              opacity,
            }}
            className="projects-experience-bridge__path"
          />
          <motion.polygon
            points={`${tip.x},${tip.y - 5} ${tip.x + 11},${tip.y} ${tip.x},${tip.y + 5}`}
            fill="var(--accent)"
            transform={`rotate(${tip.angle} ${tip.x} ${tip.y})`}
            style={{ opacity: tipOpacity }}
            className="projects-experience-bridge__arrow"
          />
        </svg>
      ) : null}
    </div>
  );
}
