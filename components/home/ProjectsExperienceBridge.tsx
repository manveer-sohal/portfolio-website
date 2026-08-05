"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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
  const tipRef = useRef<SVGPolygonElement>(null);
  const progressRef = useRef(0);
  const [path, setPath] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);

  const paint = (progress: number) => {
    progressRef.current = progress;
    const pathEl = pathRef.current;
    const tipEl = tipRef.current;
    if (!pathEl || !tipEl) return;

    const len = pathEl.getTotalLength();
    if (len <= 0) {
      tipEl.style.opacity = "0";
      return;
    }

    // Stroke + tip share the same length sample — no motion lag between them
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
    tipEl.setAttribute("transform", `rotate(${angle} ${point.x} ${point.y})`);
    tipEl.style.opacity = "1";
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = () => {
      if (window.matchMedia("(max-width: 899px)").matches) {
        setReady(false);
        setPath("");
        progressRef.current = 0;
        wrap.dataset.bridgeProgress = "0";
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

      if (!trackEl || !endEl) {
        setReady(false);
        return;
      }

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

      const headingBlock = experience?.querySelector("[data-featured-title]")
        ?.parentElement as HTMLElement | null;
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

      setPath(d);
      setSize({
        w: Math.max(Math.round(wrapRect.width), 1),
        h: Math.max(Math.round(wrapRect.height), 1),
      });
      setReady(true);
      requestAnimationFrame(() => paint(progressRef.current));
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
  }, []);

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
        wrap.dataset.bridgeProgress = "0";
        paint(0);
        raf = window.requestAnimationFrame(sync);
        return;
      }

      const vh = window.innerHeight;
      const fillH = fill.getBoundingClientRect().height;
      const trackRect = track.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();
      const trackBottom = trackRect.bottom;
      const endMid = endRect.top + endRect.height / 2;

      if (endMid < vh * 0.5 || trackBottom < vh * 0.28) {
        wrap.dataset.bridgeProgress = "1";
        paint(1);
        raf = window.requestAnimationFrame(sync);
        return;
      }

      // Start a touch earlier — fill nearly done
      const fillReady = trackRect.height > 0 && fillH >= trackRect.height * 0.8;
      if (!fillReady) {
        wrap.dataset.bridgeProgress = "0";
        paint(0);
        raf = window.requestAnimationFrame(sync);
        return;
      }

      // ~half a second earlier than the previous mid-viewport start
      const startLine = vh * 0.68;
      const endLine = vh * 0.4;
      const p = Math.min(
        1,
        Math.max(0, (startLine - trackBottom) / (startLine - endLine)),
      );

      wrap.dataset.bridgeProgress = String(p);
      paint(p);

      raf = window.requestAnimationFrame(sync);
    };

    raf = window.requestAnimationFrame(sync);
    return () => window.cancelAnimationFrame(raf);
  }, [ready, path]);

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
