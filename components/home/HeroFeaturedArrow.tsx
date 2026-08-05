"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useActiveAnimationFrame } from "@/lib/animation/useActiveAnimationFrame";
import {
  useDesktopTealRails,
  usePrefersReducedMotion,
} from "@/lib/animation/useMatchMedia";
import { useNearViewport } from "@/lib/animation/useNearViewport";

type HeroFeaturedArrowProps = {
  children: ReactNode;
};

type Tip = { x: number; y: number; angle: number };

type CachedEls = {
  cue: HTMLElement;
  track: HTMLElement;
};

/**
 * Teal cue at the bottom of the hero viewport — one continuous arrow that
 * peeks and bounces while idle. On scroll it takes a wide turn into page-center
 * and drops into the featured rail; tip hands off so only one tip is visible.
 */
export function HeroFeaturedArrow({ children }: HeroFeaturedArrowProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGPolygonElement>(null);
  const idleGroupRef = useRef<SVGGElement>(null);
  const trackTopYRef = useRef(0);
  const pathLengthRef = useRef(0);
  const elsRef = useRef<CachedEls | null>(null);
  const idleRef = useRef(true);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [idlePath, setIdlePath] = useState("");
  const [travelPath, setTravelPath] = useState("");
  const [idleTip, setIdleTip] = useState<Tip>({ x: 0, y: 0, angle: -90 });
  const [ready, setReady] = useState(false);
  const [idle, setIdle] = useState(true);

  const scrollProgress = useMotionValue(0);
  const pathProgress = useTransform(scrollProgress, [0.03, 0.83], [0, 1]);
  const travelOpacity = useTransform(scrollProgress, [0.03, 0.09], [0, 1]);
  const idleOpacity = useTransform(scrollProgress, [0, 0.07], [1, 0]);

  const desktop = useDesktopTealRails();
  const reduceMotion = usePrefersReducedMotion();
  const near = useNearViewport(wrapRef, "30% 0px 30% 0px");
  const loopActive = ready && desktop && !reduceMotion && near;

  const paintTip = useCallback((progress: number, combined: number) => {
    const pathEl = pathRef.current;
    const tipEl = tipRef.current;
    if (!pathEl || !tipEl) return;

    let len = pathLengthRef.current;
    if (len <= 0) {
      len = pathEl.getTotalLength();
      pathLengthRef.current = len;
    }
    if (len <= 0 || progress <= 0.001) {
      tipEl.style.opacity = "0";
      return;
    }

    const at = progress * len;
    const look = Math.max(8, Math.min(18, len * 0.025));
    const point = pathEl.getPointAtLength(at);
    const tangent =
      at < look
        ? pathEl.getPointAtLength(Math.min(len, at + look))
        : pathEl.getPointAtLength(at - look);
    const angle =
      at < look
        ? (Math.atan2(tangent.y - point.y, tangent.x - point.x) * 180) / Math.PI
        : (Math.atan2(point.y - tangent.y, point.x - tangent.x) * 180) /
          Math.PI;

    tipEl.setAttribute(
      "points",
      `${point.x},${point.y - 5} ${point.x + 7},${point.y} ${point.x},${point.y + 5}`,
    );
    tipEl.setAttribute(
      "transform",
      `rotate(${angle} ${point.x} ${point.y})`,
    );

    const travelFade = Math.min(1, Math.max(0, (combined - 0.03) / 0.06));
    const junction = trackTopYRef.current;
    const dist = junction - point.y;
    let next = travelFade;
    if (progress < 0.015) next = 0;
    else if (dist <= 2) next = 0;
    else if (dist < 28) next = travelFade * (dist / 28);
    tipEl.style.opacity = String(next);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = () => {
      if (!desktop) {
        setReady(false);
        elsRef.current = null;
        return;
      }

      const cue = wrap.querySelector(".hero-scroll-cue") as HTMLElement | null;
      const track = wrap.querySelector(
        ".featured-rail__track",
      ) as HTMLElement | null;
      if (!cue || !track) {
        setReady(false);
        elsRef.current = null;
        return;
      }

      elsRef.current = { cue, track };

      const wrapRect = wrap.getBoundingClientRect();
      const cueRect = cue.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();

      const startX = cueRect.left + cueRect.width / 2 - wrapRect.left;
      const startY = cueRect.top + cueRect.height / 2 - wrapRect.top;
      const midX = Math.round(
        trackRect.left + trackRect.width / 2 - wrapRect.left,
      );
      const trackTopY = trackRect.top - wrapRect.top;
      trackTopYRef.current = trackTopY;
      const endY = trackTopY + 28;

      const baseY = startY + 20;
      const tipY = startY - 36;

      setIdlePath(`M ${startX} ${baseY} L ${startX} ${tipY}`);
      setIdleTip({ x: startX, y: tipY, angle: -90 });

      const towardCenter = midX >= startX ? 1 : -1;
      const riseY = tipY - 48;
      const turnWidth = Math.max(131, Math.abs(midX - startX) * 0.45);
      const apexX = startX + towardCenter * turnWidth;
      const apexY = riseY - 28;
      const dropY = Math.min(
        trackTopY - 24,
        Math.max(startY + 80, startY + (trackTopY - startY) * 0.22),
      );

      const nextTravel = [
        `M ${startX} ${tipY}`,
        `L ${startX} ${riseY}`,
        `C ${startX} ${riseY - 36}, ${apexX} ${apexY}, ${apexX} ${apexY + 40}`,
        `C ${apexX} ${apexY + 88}, ${midX} ${startY + 40}, ${midX} ${dropY}`,
        `L ${midX} ${endY}`,
      ].join(" ");

      pathLengthRef.current = 0;
      setTravelPath(nextTravel);
      setSize({
        w: Math.max(Math.round(wrapRect.width), 1),
        h: Math.max(Math.round(wrapRect.height), 1),
      });
      setReady(true);

      requestAnimationFrame(() => {
        const pathEl = pathRef.current;
        if (pathEl) pathLengthRef.current = pathEl.getTotalLength();
        if (reduceMotion) {
          scrollProgress.set(1);
        }
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 160);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, [desktop, reduceMotion, scrollProgress]);

  useActiveAnimationFrame({
    active: loopActive,
    callback: () => {
      const els = elsRef.current;
      if (!els) {
        scrollProgress.set(0);
        return;
      }

      const vh = window.innerHeight;
      const cueY = els.cue.getBoundingClientRect().top;
      const trackTop = els.track.getBoundingClientRect().top;

      const fromCue = Math.min(1, Math.max(0, (vh * 0.92 - cueY) / (vh * 0.5)));
      const toRail = Math.min(
        1,
        Math.max(0, (vh * 0.95 - trackTop) / (vh * 0.55)),
      );
      const combined = Math.min(1, Math.max(fromCue, toRail * 0.9));

      scrollProgress.set(combined);

      const nextIdle = combined < 0.04;
      if (nextIdle !== idleRef.current) {
        idleRef.current = nextIdle;
        setIdle(nextIdle);
      }

      const progress = Math.min(1, Math.max(0, (combined - 0.03) / 0.8));
      if (travelPath) {
        paintTip(progress, combined);
      }
    },
  });

  return (
    <div ref={wrapRef} className="hero-featured-arrow">
      {children}
      {ready && size.w > 0 && idlePath && travelPath ? (
        <svg
          className="hero-featured-arrow__svg"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="xMinYMin meet"
          aria-hidden="true"
        >
          <motion.g
            ref={idleGroupRef}
            style={{ opacity: idleOpacity }}
            animate={
              reduceMotion
                ? { y: 0, rotate: 0 }
                : idle
                  ? { y: [0, -5, -2, -12, 0, -8, 0], rotate: 0 }
                  : { y: 0, rotate: 0 }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : idle
                  ? {
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.18, 0.3, 0.48, 0.62, 0.8, 1],
                    }
                  : { duration: 0.2 }
            }
          >
            <path
              d={idlePath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="butt"
              className="hero-featured-arrow__idle-path"
            />
            <polygon
              points={`${idleTip.x},${idleTip.y - 7} ${idleTip.x + 5},${idleTip.y} ${idleTip.x - 5},${idleTip.y}`}
              fill="var(--accent)"
              className="hero-featured-arrow__idle-tip"
            />
          </motion.g>

          <motion.path
            ref={pathRef}
            d={travelPath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="butt"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              pathLength: reduceMotion ? 1 : pathProgress,
              opacity: reduceMotion ? 1 : travelOpacity,
            }}
            className="hero-featured-arrow__travel-path"
          />
          <polygon
            ref={tipRef}
            points="0,0 0,0 0,0"
            fill="var(--accent)"
            style={{ opacity: 0 }}
            className="hero-featured-arrow__travel-tip"
          />
        </svg>
      ) : null}
    </div>
  );
}
