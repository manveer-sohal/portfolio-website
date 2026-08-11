"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useActiveAnimationFrame } from "@/lib/animation/useActiveAnimationFrame";
import {
  useDesktopTealRails,
  usePrefersReducedMotion,
} from "@/lib/animation/useMatchMedia";
import { useNearViewport } from "@/lib/animation/useNearViewport";

const MID = 0.5;
/** 1 = tip at right edge; >1 = whole line exits off the right */
const EXIT = 1.5;
const WAVE_AMP = 11;
const WAVE_FREQ = 2.4;
const FAST_DOWN = 1.15;
const FAST_UP = -0.45;

function wavePoint(
  startX: number,
  endX: number,
  baseY: number,
  amplitude: number,
  phase: number,
  t: number,
) {
  const span = Math.max(endX - startX, 1);
  const x = startX + span * t;
  const envelope = Math.sin(t * Math.PI);
  const y =
    baseY +
    Math.sin(t * Math.PI * WAVE_FREQ + phase) * amplitude * envelope;
  return { x, y };
}

function buildWavePath(
  startX: number,
  endX: number,
  baseY: number,
  amplitude: number,
  phase: number,
) {
  if (endX <= startX + 2) {
    return {
      d: `M ${startX} ${baseY}`,
      tip: { x: startX, y: baseY, angle: 0 },
    };
  }

  const span = endX - startX;
  const steps = Math.max(18, Math.ceil(span / 9));
  let d = `M ${startX} ${baseY}`;

  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const { x, y } = wavePoint(startX, endX, baseY, amplitude, phase, t);
    d += ` L ${x} ${y}`;
  }

  const a = wavePoint(startX, endX, baseY, amplitude, phase, 0.92);
  const b = wavePoint(startX, endX, baseY, amplitude, phase, 1);
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;

  return { d, tip: { x: b.x, y: b.y, angle } };
}

/**
 * Teal line under Recognition & Milestones.
 * Waves at mid-width in view; on scroll down shoots off the right and vanishes.
 * Retracts when scrolling back up.
 */
export function AwardsWaveLine() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGPolygonElement>(null);
  const tipGroupRef = useRef<SVGGElement>(null);
  const lastScroll = useRef({ y: 0, t: 0 });
  const wavePhase = useRef(0);
  const progress = useRef(0);
  const target = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(48);

  const [size, setSize] = useState({ w: 0, h: 48 });
  const [mounted, setMounted] = useState(false);

  const desktop = useDesktopTealRails();
  const reduceMotion = usePrefersReducedMotion();
  const near = useNearViewport(wrapRef, "20% 0px 20% 0px");
  const loopActive = mounted && desktop && !reduceMotion && near;

  const paintStaticMid = useCallback(() => {
    const w = widthRef.current;
    const h = heightRef.current;
    const pathEl = pathRef.current;
    const tipEl = tipRef.current;
    const tipGroup = tipGroupRef.current;
    if (!pathEl || !tipEl || w < 8) return;

    const baseY = h / 2;
    const midX = w * MID;
    const built = buildWavePath(0, midX, baseY, WAVE_AMP * 0.35, 0);
    pathEl.setAttribute("d", built.d);
    pathEl.style.opacity = "1";
    tipEl.setAttribute(
      "points",
      `${built.tip.x},${built.tip.y - 5} ${built.tip.x + 11},${built.tip.y} ${built.tip.x},${built.tip.y + 5}`,
    );
    tipEl.setAttribute(
      "transform",
      `rotate(${built.tip.angle} ${built.tip.x} ${built.tip.y})`,
    );
    if (tipGroup) {
      tipGroup.style.opacity = "1";
      tipGroup.style.transform = "scale(1)";
      tipGroup.style.transformOrigin = `${built.tip.x}px ${built.tip.y}px`;
    }
  }, []);

  const clearPaint = useCallback(() => {
    const pathEl = pathRef.current;
    const tipGroup = tipGroupRef.current;
    if (pathEl) {
      pathEl.setAttribute("d", "");
      pathEl.style.opacity = "0";
    }
    if (tipGroup) {
      tipGroup.style.opacity = "0";
      tipGroup.style.transform = "scale(0)";
    }
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = () => {
      const w = Math.max(Math.round(wrap.getBoundingClientRect().width), 1);
      widthRef.current = w;
      heightRef.current = 48;
      setSize({ w, h: 48 });
      setMounted(true);
      if (reduceMotion && desktop) {
        requestAnimationFrame(paintStaticMid);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [desktop, reduceMotion, paintStaticMid]);

  useEffect(() => {
    lastScroll.current = { y: window.scrollY, t: performance.now() };
  }, []);

  useEffect(() => {
    if (!loopActive) {
      if (reduceMotion && desktop && mounted) {
        paintStaticMid();
      } else if (!near || !desktop) {
        clearPaint();
        progress.current = 0;
        target.current = 0;
      }
    }
  }, [
    loopActive,
    reduceMotion,
    desktop,
    mounted,
    near,
    paintStaticMid,
    clearPaint,
  ]);

  useActiveAnimationFrame({
    active: loopActive,
    callback: (now) => {
      const w = widthRef.current;
      const h = heightRef.current;
      const pathEl = pathRef.current;
      const tipEl = tipRef.current;
      const tipGroup = tipGroupRef.current;
      const waveEl = wrapRef.current;

      if (!pathEl || !tipEl || !waveEl || w < 8) return;

      const waveRect = waveEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const waveInView =
        waveRect.bottom > vh * 0.08 && waveRect.top < vh * 0.92;

      if (!waveInView) {
        progress.current = 0;
        target.current = 0;
        clearPaint();
        lastScroll.current = { y: window.scrollY, t: now };
        return;
      }

      const leavingDown = waveRect.bottom < vh * 0.28;
      const scrollY = window.scrollY;
      const dt = Math.max(now - lastScroll.current.t, 1);
      const vel = (scrollY - lastScroll.current.y) / dt;
      lastScroll.current = { y: scrollY, t: now };

      if (
        (leavingDown && vel > 0.12) ||
        (vel > FAST_DOWN && waveRect.bottom < vh * 0.45)
      ) {
        target.current = EXIT;
      } else if (vel < FAST_UP) {
        target.current = MID;
      } else if (target.current < 0.95) {
        target.current = MID;
      }

      if (progress.current >= EXIT - 0.02 && target.current < 1) {
        progress.current = 0;
      }

      const accelerating = target.current > progress.current;
      let lerp = 0.18;
      if (target.current >= EXIT) {
        lerp = 0.14;
      } else if (accelerating && target.current <= MID) {
        const t = Math.min(1, progress.current / MID);
        lerp = 0.028 + t * t * 0.2;
      } else if (accelerating) {
        lerp = 0.11;
      }
      progress.current += (target.current - progress.current) * lerp;
      if (Math.abs(target.current - progress.current) < 0.002) {
        progress.current = target.current;
      }

      const p = progress.current;
      const baseY = h / 2;
      const midX = w * MID;

      if (p >= EXIT - 0.02 && target.current >= EXIT) {
        clearPaint();
        return;
      }

      const show = p > 0.02;
      const arrowActive = p > 0.08 && p < EXIT - 0.05;

      let startX = 0;
      let drawEndX = 0;
      let d = `M 0 ${baseY}`;
      let nextTip = { x: 0, y: baseY, angle: 0 };

      if (p <= MID) {
        wavePhase.current += 0.05;
        const linear = p / MID;
        const grow = linear * linear * linear;
        const wobble = Math.sin(wavePhase.current * 0.85) * (w * 0.05);
        drawEndX = Math.max(8, (midX + wobble) * Math.max(grow, 0.02));
        const built = buildWavePath(
          0,
          drawEndX,
          baseY,
          WAVE_AMP,
          wavePhase.current,
        );
        d = built.d;
        nextTip = built.tip;
      } else if (p <= 1) {
        const t = (p - MID) / (1 - MID);
        drawEndX = midX + (w - midX) * t;
        const amp = WAVE_AMP * (1 - t);
        if (amp < 0.45) {
          d = `M 0 ${baseY} L ${drawEndX} ${baseY}`;
          nextTip = { x: drawEndX, y: baseY, angle: 0 };
        } else {
          const built = buildWavePath(
            0,
            drawEndX,
            baseY,
            amp,
            wavePhase.current,
          );
          d = built.d;
          nextTip = built.tip;
        }
      } else {
        const t = (p - 1) / (EXIT - 1);
        const tipX = w + 64 * t;
        startX = t * (w + 64);
        drawEndX = tipX;
        d = `M ${startX} ${baseY} L ${drawEndX} ${baseY}`;
        nextTip = { x: drawEndX, y: baseY, angle: 0 };
      }

      pathEl.setAttribute("d", d);
      pathEl.style.opacity = show ? "1" : "0";
      tipEl.setAttribute(
        "points",
        `${nextTip.x},${nextTip.y - 5} ${nextTip.x + 11},${nextTip.y} ${nextTip.x},${nextTip.y + 5}`,
      );
      tipEl.setAttribute(
        "transform",
        `rotate(${nextTip.angle} ${nextTip.x} ${nextTip.y})`,
      );
      if (tipGroup) {
        tipGroup.style.opacity = arrowActive ? "1" : "0";
        tipGroup.style.transform = arrowActive ? "scale(1)" : "scale(0)";
        tipGroup.style.transformOrigin = `${nextTip.x}px ${nextTip.y}px`;
        tipGroup.style.transition =
          "opacity 0.15s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)";
      }
    },
  });

  const svgW = Math.max(size.w + 80, 1);

  if (!desktop) {
    return <div ref={wrapRef} className="awards-wave" aria-hidden="true" />;
  }

  return (
    <div ref={wrapRef} className="awards-wave" aria-hidden="true">
      {mounted && size.w > 0 ? (
        <svg
          className="awards-wave__svg"
          width={svgW}
          height={size.h}
          viewBox={`0 0 ${svgW} ${size.h}`}
          preserveAspectRatio="xMinYMid meet"
        >
          <path
            ref={pathRef}
            d=""
            fill="none"
            stroke="var(--flow-line-color, var(--accent))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="awards-wave__path"
            style={{ opacity: 0 }}
          />
          <g
            ref={tipGroupRef}
            style={{ opacity: 0, transform: "scale(0)" }}
          >
            <polygon
              ref={tipRef}
              points="0,0 0,0 0,0"
              fill="var(--flow-line-color, var(--accent))"
              className="awards-wave__arrow"
            />
          </g>
        </svg>
      ) : null}
    </div>
  );
}
