"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

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
  const lastScroll = useRef({ y: 0, t: 0 });
  const wavePhase = useRef(0);
  const progress = useRef(0);
  const target = useRef(0);
  const rafRef = useRef(0);

  const [size, setSize] = useState({ w: 0, h: 48 });
  const [path, setPath] = useState("");
  const [tip, setTip] = useState({ x: 0, y: 24, angle: 0 });
  const [visible, setVisible] = useState(false);
  const [arrowActive, setArrowActive] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = () => {
      const w = Math.max(Math.round(wrap.getBoundingClientRect().width), 1);
      setSize({ w, h: 48 });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    lastScroll.current = { y: window.scrollY, t: performance.now() };

    const tick = (now: number) => {
      const section = document.getElementById("awards");
      const waveEl = wrapRef.current;
      const w = size.w;

      if (!section || !waveEl || w < 8) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (window.matchMedia("(max-width: 899px)").matches) {
        progress.current = 0;
        target.current = 0;
        setVisible(false);
        setArrowActive(false);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const waveRect = waveEl.getBoundingClientRect();
      const vh = window.innerHeight;
      // Only run while the squiggly line itself is on screen
      const waveInView =
        waveRect.bottom > vh * 0.08 && waveRect.top < vh * 0.92;

      if (!waveInView) {
        progress.current = 0;
        target.current = 0;
        setVisible(false);
        setArrowActive(false);
        setPath("");
        lastScroll.current = { y: window.scrollY, t: now };
        rafRef.current = requestAnimationFrame(tick);
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

      // After a full exit, snap back so the next entrance grows from the left
      if (
        progress.current >= EXIT - 0.02 &&
        target.current < 1
      ) {
        progress.current = 0;
      }

      // Entrance: crawl from the left, then surge toward mid; exit stays snappy
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
      const baseY = size.h / 2;
      const midX = w * MID;

      // Fully exited off the right
      if (p >= EXIT - 0.02 && target.current >= EXIT) {
        setVisible(false);
        setArrowActive(false);
        setPath("");
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const show = p > 0.02;
      setVisible(show);
      setArrowActive(p > 0.08 && p < EXIT - 0.05);

      let startX = 0;
      let drawEndX = 0;
      let d = `M 0 ${baseY}`;
      let nextTip = { x: 0, y: baseY, angle: 0 };

      if (p <= MID) {
        // Grow from left → mid: slow start, then quickly fill to center
        wavePhase.current += 0.05;
        const linear = p / MID;
        const grow = linear * linear * linear; // ease-in
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
        // Shoot tip from mid → right edge, straighten
        const t = (p - MID) / (1 - MID);
        drawEndX = midX + (w - midX) * t;
        const amp = WAVE_AMP * (1 - t);
        if (amp < 0.45) {
          d = `M 0 ${baseY} L ${drawEndX} ${baseY}`;
          nextTip = { x: drawEndX, y: baseY, angle: 0 };
        } else {
          const built = buildWavePath(0, drawEndX, baseY, amp, wavePhase.current);
          d = built.d;
          nextTip = built.tip;
        }
      } else {
        // Slide the whole line off the right edge
        const t = (p - 1) / (EXIT - 1);
        const tipX = w + 64 * t;
        startX = t * (w + 64);
        drawEndX = tipX;
        d = `M ${startX} ${baseY} L ${drawEndX} ${baseY}`;
        nextTip = { x: drawEndX, y: baseY, angle: 0 };
      }

      setPath(d);
      setTip(nextTip);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size.w, size.h]);

  // SVG must be wide enough to draw past the right edge while exiting
  const svgW = Math.max(size.w + 80, 1);

  return (
    <div ref={wrapRef} className="awards-wave" aria-hidden="true">
      {visible && size.w > 0 && path ? (
        <svg
          className="awards-wave__svg"
          width={svgW}
          height={size.h}
          viewBox={`0 0 ${svgW} ${size.h}`}
        >
          <path
            d={path}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="awards-wave__path"
          />
          <motion.g
            initial={false}
            animate={{
              scale: arrowActive ? 1 : 0,
              opacity: arrowActive ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 22,
              mass: 0.7,
            }}
            style={{ transformOrigin: `${tip.x}px ${tip.y}px` }}
          >
            <polygon
              points={`${tip.x},${tip.y - 5} ${tip.x + 11},${tip.y} ${tip.x},${tip.y + 5}`}
              fill="var(--accent)"
              transform={`rotate(${tip.angle} ${tip.x} ${tip.y})`}
              className="awards-wave__arrow"
            />
          </motion.g>
        </svg>
      ) : null}
    </div>
  );
}
