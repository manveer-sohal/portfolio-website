"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { setBridgeProgress } from "@/lib/animation/bridgeProgress";
import { useActiveAnimationFrame } from "@/lib/animation/useActiveAnimationFrame";
import {
  useDesktopTealRails,
  usePrefersReducedMotion,
} from "@/lib/animation/useMatchMedia";
import { useNearViewport } from "@/lib/animation/useNearViewport";

type ProjectsExperienceBridgeProps = {
  children: ReactNode;
};

type CachedEls = {
  fill: HTMLElement;
  track: HTMLElement;
  endEl: HTMLElement;
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
  const tipRef = useRef<SVGPolygonElement>(null);
  const progressRef = useRef(0);
  const pathLengthRef = useRef(0);
  const elsRef = useRef<CachedEls | null>(null);

  const [path, setPath] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);

  const desktop = useDesktopTealRails();
  const reduceMotion = usePrefersReducedMotion();
  const near = useNearViewport(wrapRef, "30% 0px 30% 0px");
  const loopActive = ready && desktop && !reduceMotion && near;

  const paint = useCallback((progress: number) => {
    progressRef.current = progress;
    setBridgeProgress(progress);

    const pathEl = pathRef.current;
    const tipEl = tipRef.current;
    if (!pathEl || !tipEl) return;

    let len = pathLengthRef.current;
    if (len <= 0) {
      len = pathEl.getTotalLength();
      pathLengthRef.current = len;
    }
    if (len <= 0) {
      tipEl.style.opacity = "0";
      return;
    }

    pathEl.style.strokeDasharray = `${len}`;
    pathEl.style.strokeDashoffset = `${len * (1 - progress)}`;

    if (progress <= 0.001 || progress >= 0.985) {
      tipEl.style.opacity = "0";
      return;
    }

    const at = progress * len;
    const look = Math.min(6, Math.max(2, len * 0.008));
    const point = pathEl.getPointAtLength(at);
    const prev = pathEl.getPointAtLength(Math.max(0, at - look));
    const angle =
      (Math.atan2(point.y - prev.y, point.x - prev.x) * 180) / Math.PI;

    tipEl.setAttribute(
      "points",
      `${point.x},${point.y - 5} ${point.x + 7},${point.y} ${point.x},${point.y + 5}`,
    );
    tipEl.setAttribute(
      "transform",
      `rotate(${angle} ${point.x} ${point.y})`,
    );
    tipEl.style.opacity = "1";
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = () => {
      if (!desktop) {
        setReady(false);
        setPath("");
        progressRef.current = 0;
        pathLengthRef.current = 0;
        elsRef.current = null;
        setBridgeProgress(0);
        return;
      }

      if (reduceMotion) {
        // Stable full connector for reduced motion once geometry exists
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
      const fillEl = wrap.querySelector(
        ".featured-rail__fill",
      ) as HTMLElement | null;
      const experience = wrap.querySelector("#experience");

      if (!trackEl || !endEl || !fillEl) {
        setReady(false);
        elsRef.current = null;
        return;
      }

      elsRef.current = { fill: fillEl, track: trackEl, endEl };

      const wrapRect = wrap.getBoundingClientRect();
      const trackRect = trackEl.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();
      const railRect = railEl?.getBoundingClientRect();

      const startX = Math.round(
        trackRect.left + trackRect.width / 2 - wrapRect.left,
      );
      const startY = trackRect.bottom - wrapRect.top;

      const endX = Math.round(
        railRect
          ? railRect.left + railRect.width / 2 - wrapRect.left
          : endRect.left + endRect.width / 2 - wrapRect.left,
      );
      const endY = endRect.top + endRect.height / 2 - wrapRect.top;

      const headingBlock = experience?.querySelector(
        "[data-featured-title]",
      )?.parentElement as HTMLElement | null;
      const headingBottom = headingBlock
        ? headingBlock.getBoundingClientRect().bottom - wrapRect.top
        : endY - 64;
      const turnY = Math.max(
        startY + 16,
        Math.min(headingBottom + 12, endY - 28),
      );
      const r = Math.min(40, Math.max(24, Math.abs(startX - endX) * 0.08));
      const joinY = startY - 2;

      const d = [
        `M ${startX} ${joinY}`,
        `L ${startX} ${turnY - r}`,
        `C ${startX} ${turnY - r * 0.35}, ${startX - r * 0.35} ${turnY}, ${startX - r} ${turnY}`,
        `L ${endX + r} ${turnY}`,
        `C ${endX + r * 0.35} ${turnY}, ${endX} ${turnY + r * 0.35}, ${endX} ${turnY + r}`,
        `L ${endX} ${endY}`,
      ].join(" ");

      pathLengthRef.current = 0;
      setPath(d);
      setSize({
        w: Math.max(Math.round(wrapRect.width), 1),
        h: Math.max(Math.round(wrapRect.height), 1),
      });
      setReady(true);

      requestAnimationFrame(() => {
        const pathEl = pathRef.current;
        if (pathEl) pathLengthRef.current = pathEl.getTotalLength();
        if (reduceMotion) {
          paint(1);
        } else {
          paint(progressRef.current);
        }
      });
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
  }, [desktop, reduceMotion, paint]);

  useActiveAnimationFrame({
    active: loopActive,
    callback: () => {
      const els = elsRef.current;
      if (!els) {
        paint(0);
        return;
      }

      const { fill, track, endEl } = els;
      const vh = window.innerHeight;
      const fillH = fill.getBoundingClientRect().height;
      const trackRect = track.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();
      const trackBottom = trackRect.bottom;
      const endMid = endRect.top + endRect.height / 2;

      if (endMid < vh * 0.5 || trackBottom < vh * 0.28) {
        paint(1);
        return;
      }

      const fillReady =
        trackRect.height > 0 && fillH >= trackRect.height * 0.8;
      if (!fillReady) {
        paint(0);
        return;
      }

      const startLine = vh * 0.68;
      const endLine = vh * 0.4;
      const p = Math.min(
        1,
        Math.max(0, (startLine - trackBottom) / (startLine - endLine)),
      );
      paint(p);
    },
  });

  // When the loop stops (offscreen / mobile), leave last progress but stop frames
  useEffect(() => {
    if (!loopActive && !desktop) {
      setBridgeProgress(0);
    }
  }, [loopActive, desktop]);

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
          <path
            ref={pathRef}
            d={path}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="butt"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="projects-experience-bridge__path"
          />
          <polygon
            ref={tipRef}
            points="0,0 0,0 0,0"
            fill="var(--accent)"
            style={{ opacity: 0 }}
            className="projects-experience-bridge__arrow"
          />
        </svg>
      ) : null}
    </div>
  );
}
