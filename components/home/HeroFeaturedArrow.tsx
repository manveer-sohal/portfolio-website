"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

type HeroFeaturedArrowProps = {
  children: ReactNode;
};

type Tip = { x: number; y: number; angle: number };

/**
 * Teal cue at the bottom of the hero viewport — one continuous arrow that
 * peeks and bounces while idle. On scroll it takes a wide turn into page-center
 * and drops into the featured rail; tip hands off so only one tip is visible.
 */
export function HeroFeaturedArrow({ children }: HeroFeaturedArrowProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const trackTopYRef = useRef(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [idlePath, setIdlePath] = useState("");
  const [travelPath, setTravelPath] = useState("");
  const [idleTip, setIdleTip] = useState<Tip>({ x: 0, y: 0, angle: -90 });
  const [tip, setTip] = useState<Tip>({ x: 0, y: 0, angle: -90 });
  const [ready, setReady] = useState(false);
  const [idle, setIdle] = useState(true);

  const scrollProgress = useMotionValue(0);
  const tipOpacity = useMotionValue(0);
  const pathProgress = useTransform(scrollProgress, [0.03, 0.83], [0, 1]);
  const travelOpacity = useTransform(scrollProgress, [0.03, 0.09], [0, 1]);
  const idleOpacity = useTransform(scrollProgress, [0, 0.07], [1, 0]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = () => {
      if (window.matchMedia("(max-width: 899px)").matches) {
        setReady(false);
        return;
      }

      const cue = wrap.querySelector(".hero-scroll-cue") as HTMLElement | null;
      const track = wrap.querySelector(
        ".featured-rail__track",
      ) as HTMLElement | null;
      if (!cue || !track) {
        setReady(false);
        return;
      }

      const wrapRect = wrap.getBoundingClientRect();
      const cueRect = cue.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();

      const startX = cueRect.left + cueRect.width / 2 - wrapRect.left;
      const startY = cueRect.top + cueRect.height / 2 - wrapRect.top;
      // Snap to the same centerline the CSS track uses (left 50% + translateX -50%)
      const midX = Math.round(
        trackRect.left + trackRect.width / 2 - wrapRect.left,
      );
      const trackTopY = trackRect.top - wrapRect.top;
      trackTopYRef.current = trackTopY;
      // Overlap into the rail so stroke + fill meet with no gap
      const endY = trackTopY + 28;

      const baseY = startY + 20;
      const tipY = startY - 36;

      // One continuous upward arrow (shaft + tip) — always vertical
      setIdlePath(`M ${startX} ${baseY} L ${startX} ${tipY}`);
      setIdleTip({ x: startX, y: tipY, angle: -90 });

      // Rise straight up first, then a compact turn into the center rail
      const towardCenter = midX >= startX ? 1 : -1;
      const riseY = tipY - 48;
      const turnWidth = Math.max(131, Math.abs(midX - startX) * 0.45);
      const apexX = startX + towardCenter * turnWidth;
      const apexY = riseY - 28;
      const dropY = Math.min(
        trackTopY - 24,
        Math.max(startY + 80, startY + (trackTopY - startY) * 0.22),
      );

      setTravelPath(
        [
          // Continue the idle shaft straight up
          `M ${startX} ${tipY}`,
          `L ${startX} ${riseY}`,
          // Compact turn toward page center, finishing pointed down
          `C ${startX} ${riseY - 36}, ${apexX} ${apexY}, ${apexX} ${apexY + 40}`,
          `C ${apexX} ${apexY + 88}, ${midX} ${startY + 40}, ${midX} ${dropY}`,
          // Straight down into the featured rail
          `L ${midX} ${endY}`,
        ].join(" "),
      );

      setSize({
        w: Math.max(Math.round(wrapRect.width), 1),
        h: Math.max(Math.round(wrapRect.height), 1),
      });
      setReady(true);
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
  }, []);

  useEffect(() => {
    let raf = 0;
    const sync = () => {
      const wrap = wrapRef.current;
      const cue = wrap?.querySelector(".hero-scroll-cue") as HTMLElement | null;
      const track = wrap?.querySelector(
        ".featured-rail__track",
      ) as HTMLElement | null;

      if (
        !wrap ||
        !cue ||
        !track ||
        window.matchMedia("(max-width: 899px)").matches
      ) {
        scrollProgress.set(0);
        tipOpacity.set(0);
        setIdle(true);
        raf = requestAnimationFrame(sync);
        return;
      }

      const vh = window.innerHeight;
      const cueY = cue.getBoundingClientRect().top;
      const trackTop = track.getBoundingClientRect().top;

      const fromCue = Math.min(1, Math.max(0, (vh * 0.92 - cueY) / (vh * 0.5)));
      const toRail = Math.min(
        1,
        Math.max(0, (vh * 0.95 - trackTop) / (vh * 0.55)),
      );
      const combined = Math.min(1, Math.max(fromCue, toRail * 0.9));

      scrollProgress.set(combined);
      setIdle(combined < 0.04);

      const pathEl = pathRef.current;
      // Keep tip on the same progress curve as pathLength so it stays flush
      const progress = Math.min(1, Math.max(0, (combined - 0.03) / 0.8));
      if (pathEl && progress > 0.001 && travelPath) {
        const len = pathEl.getTotalLength();
        if (len > 0) {
          const at = progress * len;
          const look = Math.max(8, Math.min(18, len * 0.025));
          const point = pathEl.getPointAtLength(at);
          // Near the start, look ahead so the tip faces up the path (not sideways)
          const tangent =
            at < look
              ? pathEl.getPointAtLength(Math.min(len, at + look))
              : pathEl.getPointAtLength(at - look);
          const angle =
            at < look
              ? (Math.atan2(tangent.y - point.y, tangent.x - point.x) * 180) /
                Math.PI
              : (Math.atan2(point.y - tangent.y, point.x - tangent.x) * 180) /
                Math.PI;
          setTip({ x: point.x, y: point.y, angle });

          // Fade with travel reveal; hide once the tip reaches the rail
          const travelFade = Math.min(1, Math.max(0, (combined - 0.03) / 0.06));
          const junction = trackTopYRef.current;
          const dist = junction - point.y;
          let next = travelFade;
          if (progress < 0.015) next = 0;
          else if (dist <= 2) next = 0;
          else if (dist < 28) next = travelFade * (dist / 28);
          tipOpacity.set(next);
        }
      } else {
        tipOpacity.set(0);
      }

      raf = requestAnimationFrame(sync);
    };

    raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgress, tipOpacity, travelPath, size.w]);

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
            style={{ opacity: idleOpacity }}
            animate={
              idle
                ? { y: [0, -5, -2, -12, 0, -8, 0], rotate: 0 }
                : { y: 0, rotate: 0 }
            }
            transition={
              idle
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
            {/* Base sits on the shaft end so tip + line read as one mark */}
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
              pathLength: pathProgress,
              opacity: travelOpacity,
            }}
            className="hero-featured-arrow__travel-path"
          />
          {/* Base on path end; tip extends forward along the stroke */}
          <motion.polygon
            points={`${tip.x},${tip.y - 5} ${tip.x + 7},${tip.y} ${tip.x},${tip.y + 5}`}
            fill="var(--accent)"
            transform={`rotate(${tip.angle} ${tip.x} ${tip.y})`}
            style={{ opacity: tipOpacity }}
            className="hero-featured-arrow__travel-tip"
          />
        </svg>
      ) : null}
    </div>
  );
}
