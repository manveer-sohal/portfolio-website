"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const LINE_DELAY_MS = 900;
const LINE_DRAW_S = 0.85;

/**
 * Teal path that appears after a short delay as Contact reveals,
 * then the arrow grows in once the line finishes drawing.
 */
export function ContactFormPointer() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineDelayTimer = useRef<number | null>(null);
  const wasRevealed = useRef(false);

  const [path, setPath] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [tip, setTip] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [lineActive, setLineActive] = useState(false);
  const [arrowActive, setArrowActive] = useState(false);

  useEffect(() => {
    const section = document.querySelector(
      ".contact-form-section",
    ) as HTMLElement | null;
    sectionRef.current = section;
    if (!section) return;

    const measure = () => {
      if (window.matchMedia("(max-width: 899px)").matches) {
        setReady(false);
        setPath("");
        return;
      }

      const intro = section.querySelector(
        ".contact-form-section__intro",
      ) as HTMLElement | null;
      const form = section.querySelector(
        ".contact-form",
      ) as HTMLElement | null;
      if (!intro || !form) {
        setReady(false);
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const introRect = intro.getBoundingClientRect();
      const formRect = form.getBoundingClientRect();

      const w = Math.max(Math.round(sectionRect.width), 1);
      const h = Math.max(Math.round(sectionRect.height), 1);

      const startX = introRect.left - sectionRect.left + 10;
      const startY = 8;
      const turnY = formRect.top - sectionRect.top + formRect.height * 0.72;
      const formLeft = formRect.left - sectionRect.left;
      const gap = formLeft - startX;
      const endX = startX + gap * 0.52;
      const endY = turnY;
      const r = Math.min(64, Math.max(40, gap * 0.22));

      const d = [
        `M ${startX} ${startY}`,
        `L ${startX} ${turnY - r}`,
        `C ${startX} ${turnY - r * 0.25}, ${startX + r * 0.35} ${turnY}, ${startX + r} ${turnY}`,
        `L ${endX} ${endY}`,
      ].join(" ");

      setPath(d);
      setTip({ x: endX, y: endY });
      setSize({ w, h });
      setReady(true);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 150);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, []);

  // Reveal gate → delay → draw line
  useEffect(() => {
    let raf = 0;

    const clearDelay = () => {
      if (lineDelayTimer.current !== null) {
        window.clearTimeout(lineDelayTimer.current);
        lineDelayTimer.current = null;
      }
    };

    const reset = () => {
      clearDelay();
      wasRevealed.current = false;
      setLineActive(false);
      setArrowActive(false);
    };

    const sync = () => {
      if (window.matchMedia("(max-width: 899px)").matches) {
        reset();
        raf = window.requestAnimationFrame(sync);
        return;
      }

      const content = document.querySelector(
        ".page-content-layer",
      ) as HTMLElement | null;
      const vh = window.innerHeight;
      let revealed = false;

      if (!content) {
        const section = sectionRef.current;
        if (section) {
          const top = section.getBoundingClientRect().top;
          revealed = top < vh * 0.52;
        }
      } else {
        const bottom = content.getBoundingClientRect().bottom;
        revealed = bottom < vh * 0.5;
      }

      if (revealed && !wasRevealed.current) {
        wasRevealed.current = true;
        clearDelay();
        lineDelayTimer.current = window.setTimeout(() => {
          setLineActive(true);
          lineDelayTimer.current = null;
        }, LINE_DELAY_MS);
      } else if (!revealed && wasRevealed.current) {
        reset();
      }

      raf = window.requestAnimationFrame(sync);
    };

    raf = window.requestAnimationFrame(sync);
    return () => {
      window.cancelAnimationFrame(raf);
      clearDelay();
    };
  }, []);

  if (!ready || !path) return null;

  return (
    <svg
      className="contact-form-pointer"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      preserveAspectRatio="xMinYMin meet"
      aria-hidden="true"
    >
      <motion.path
        d={path}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={false}
        animate={{ pathLength: lineActive ? 1 : 0, opacity: lineActive ? 1 : 0 }}
        transition={{
          pathLength: {
            duration: LINE_DRAW_S,
            ease: [0.22, 1, 0.36, 1],
          },
          opacity: { duration: 0.2 },
        }}
        onAnimationComplete={() => {
          if (lineActive) setArrowActive(true);
        }}
        className="contact-form-pointer__path"
      />
      <motion.polygon
        points={`${tip.x},${tip.y - 5} ${tip.x + 10},${tip.y} ${tip.x},${tip.y + 5}`}
        fill="var(--accent)"
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
        className="contact-form-pointer__arrow"
      />
    </svg>
  );
}
