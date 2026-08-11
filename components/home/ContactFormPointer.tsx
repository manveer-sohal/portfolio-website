"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  useDesktopTealRails,
  usePrefersReducedMotion,
} from "@/lib/animation/useMatchMedia";
import {
  applyStrokeDash,
  readGeometricLength,
} from "@/lib/animation/svgStroke";

const LINE_DELAY_MS = 900;
const LINE_DRAW_MS = 850;
/** Reveal on / hide only after clear reverse margin — prevents sticky flap. */
const REVEAL_ON = 0.52;
const REVEAL_OFF = 0.62;

/**
 * Teal path that appears after a short delay as Contact reveals,
 * then the arrow grows in once the line finishes drawing.
 *
 * Geometry matches HeroFeaturedArrow: integer viewBox, preserveAspectRatio
 * none, manual stroke-dasharray (no Framer pathLength attribute).
 */
export function ContactFormPointer() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentLayerRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathLengthRef = useRef(0);
  const drawProgressRef = useRef(0);
  const lineDelayTimer = useRef<number | null>(null);
  const drawRaf = useRef<number | null>(null);
  const wasRevealed = useRef(false);
  const pathKeyRef = useRef("");
  const lineActiveRef = useRef(false);

  const [path, setPath] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [tip, setTip] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [lineActive, setLineActive] = useState(false);
  const [arrowActive, setArrowActive] = useState(false);
  const [near, setNear] = useState(false);

  const desktop = useDesktopTealRails();
  const reduceMotion = usePrefersReducedMotion();

  lineActiveRef.current = lineActive;

  const clearDelay = useCallback(() => {
    if (lineDelayTimer.current !== null) {
      window.clearTimeout(lineDelayTimer.current);
      lineDelayTimer.current = null;
    }
  }, []);

  const clearDraw = useCallback(() => {
    if (drawRaf.current !== null) {
      window.cancelAnimationFrame(drawRaf.current);
      drawRaf.current = null;
    }
  }, []);

  const paintProgress = useCallback((progress: number) => {
    drawProgressRef.current = progress;
    const pathEl = pathRef.current;
    if (pathEl) applyStrokeDash(pathEl, progress, pathLengthRef);
  }, []);

  const reset = useCallback(() => {
    clearDelay();
    clearDraw();
    wasRevealed.current = false;
    lineActiveRef.current = false;
    setLineActive(false);
    setArrowActive(false);
    paintProgress(0);
  }, [clearDelay, clearDraw, paintProgress]);

  // Geometry only — must not restart when lineActive flips (that caused the flash).
  useEffect(() => {
    const section = document.querySelector(
      ".contact-form-section",
    ) as HTMLElement | null;
    sectionRef.current = section;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { root: null, rootMargin: "35% 0px 35% 0px", threshold: 0 },
    );
    io.observe(section);

    const measure = () => {
      if (!desktop) {
        setReady(false);
        setPath("");
        pathKeyRef.current = "";
        return;
      }

      const intro = section.querySelector(
        ".contact-form-section__intro",
      ) as HTMLElement | null;
      const form = section.querySelector(".contact-form") as HTMLElement | null;
      const content = document.querySelector(
        ".page-content-layer",
      ) as HTMLElement | null;

      contentLayerRef.current = content;

      if (!intro || !form) {
        setReady(false);
        return;
      }

      const w = Math.max(Math.round(section.clientWidth), 1);
      const h = Math.max(Math.round(section.scrollHeight), 1);

      const sectionRect = section.getBoundingClientRect();
      const introRect = intro.getBoundingClientRect();
      const formRect = form.getBoundingClientRect();

      const EDGE_X = 20;
      const TEXT_CLEAR = 22;
      const introLeft = introRect.left - sectionRect.left;
      const introBottom = introRect.bottom - sectionRect.top;
      const startX = Math.round(Math.min(EDGE_X, introLeft - TEXT_CLEAR));

      if (startX < 10 || introLeft - startX < TEXT_CLEAR) {
        setReady(false);
        setPath("");
        pathKeyRef.current = "";
        return;
      }

      const startY = 8;
      const formMidY =
        formRect.top - sectionRect.top + formRect.height * 0.55;
      const turnY = Math.max(formMidY, introBottom + TEXT_CLEAR);
      const formLeft = formRect.left - sectionRect.left;
      const formGap = Math.round(
        Math.min(60, Math.max(20, (formLeft - startX) * 0.12)),
      );
      const endX = Math.round(formLeft - formGap);
      const endY = Math.min(
        turnY,
        formRect.bottom - sectionRect.top - 24,
      );
      if (endX - startX < 48) {
        setReady(false);
        setPath("");
        pathKeyRef.current = "";
        return;
      }
      const span = Math.max(endX - startX, 1);
      const r = Math.min(48, Math.max(28, span * 0.1));

      const d = [
        `M ${startX} ${startY}`,
        `L ${startX} ${endY - r}`,
        `C ${startX} ${endY - r * 0.25}, ${startX + r * 0.35} ${endY}, ${startX + r} ${endY}`,
        `L ${endX} ${endY}`,
      ].join(" ");

      const key = `${w}x${h}|${d}`;
      const geometryChanged = key !== pathKeyRef.current;
      pathKeyRef.current = key;

      section.style.setProperty("--flow-line-color", "var(--accent)");
      section.style.setProperty("--flow-line-width", "2px");
      section.style.setProperty("--flow-contact-start-x", `${startX}px`);
      section.style.setProperty("--flow-contact-end-x", `${endX}px`);

      if (geometryChanged) {
        pathLengthRef.current = 0;
        setPath(d);
        setTip({ x: endX, y: endY });
        setSize({ w, h });
      }
      setReady(true);

      requestAnimationFrame(() => {
        const pathEl = pathRef.current;
        if (!pathEl) return;
        pathLengthRef.current = readGeometricLength(pathEl);
        if (reduceMotion) {
          paintProgress(1);
        } else if (lineActiveRef.current) {
          paintProgress(drawProgressRef.current);
        } else {
          paintProgress(0);
        }
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    const introEl = section.querySelector(".contact-form-section__intro");
    const formEl = section.querySelector(".contact-form");
    if (introEl) observer.observe(introEl);
    if (formEl) observer.observe(formEl);
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 150);
    return () => {
      io.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, [desktop, reduceMotion, paintProgress]);

  useEffect(() => {
    if (!ready || !desktop || reduceMotion || !near) {
      if (!near || !desktop) reset();
      if (reduceMotion && ready && desktop) {
        setLineActive(true);
        setArrowActive(true);
        paintProgress(1);
      }
      return;
    }

    const evaluate = () => {
      const vh = window.innerHeight;
      const content = contentLayerRef.current;
      const section = sectionRef.current;

      if (!content) {
        if (!section) return;
        const top = section.getBoundingClientRect().top;
        if (top < vh * REVEAL_ON && !wasRevealed.current) {
          wasRevealed.current = true;
          clearDelay();
          lineDelayTimer.current = window.setTimeout(() => {
            setLineActive(true);
            lineDelayTimer.current = null;
          }, LINE_DELAY_MS);
        } else if (top > vh * REVEAL_OFF && wasRevealed.current) {
          reset();
        }
        return;
      }

      const ratio = content.getBoundingClientRect().bottom / vh;
      if (ratio < REVEAL_ON && !wasRevealed.current) {
        wasRevealed.current = true;
        clearDelay();
        lineDelayTimer.current = window.setTimeout(() => {
          setLineActive(true);
          lineDelayTimer.current = null;
        }, LINE_DELAY_MS);
      } else if (ratio > REVEAL_OFF && wasRevealed.current) {
        reset();
      }
    };

    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => {
      window.removeEventListener("scroll", evaluate);
      clearDelay();
    };
  }, [ready, desktop, reduceMotion, near, reset, clearDelay, paintProgress]);

  // Start draw once when lineActive becomes true — do not restart on remasure
  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl || !lineActive) return;

    if (reduceMotion) {
      paintProgress(1);
      setArrowActive(true);
      return;
    }

    // Already finished (e.g. remount after geometry tweak) — keep complete
    if (drawProgressRef.current >= 0.999) {
      paintProgress(1);
      setArrowActive(true);
      return;
    }

    clearDraw();
    setArrowActive(false);
    const startProgress = drawProgressRef.current;
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / LINE_DRAW_MS);
      const progress = startProgress + (1 - startProgress) * easeOut(t);
      paintProgress(progress);
      if (t < 1) {
        drawRaf.current = window.requestAnimationFrame(tick);
      } else {
        drawRaf.current = null;
        paintProgress(1);
        setArrowActive(true);
      }
    };
    drawRaf.current = window.requestAnimationFrame(tick);
    return () => clearDraw();
  }, [lineActive, reduceMotion, clearDraw, paintProgress]);

  // After path string mounts/updates, re-bind length and current progress
  useEffect(() => {
    if (!path) return;
    const pathEl = pathRef.current;
    if (!pathEl) return;
    pathLengthRef.current = readGeometricLength(pathEl);
    if (reduceMotion) {
      paintProgress(1);
    } else if (lineActiveRef.current) {
      paintProgress(drawProgressRef.current);
    } else {
      paintProgress(0);
    }
  }, [path, reduceMotion, paintProgress]);

  if (!ready || !path || !desktop) return null;

  return (
    <svg
      className="contact-form-pointer"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke="var(--flow-line-color, var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="contact-form-pointer__path"
        style={{ opacity: lineActive || reduceMotion ? 1 : 0 }}
      />
      <motion.polygon
        points={`${tip.x},${tip.y - 5} ${tip.x + 10},${tip.y} ${tip.x},${tip.y + 5}`}
        fill="var(--flow-line-color, var(--accent))"
        initial={false}
        animate={{
          scale: arrowActive ? 1 : 0,
          opacity: arrowActive ? 1 : 0,
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: 420,
                damping: 22,
                mass: 0.7,
              }
        }
        style={{ transformOrigin: `${tip.x}px ${tip.y}px` }}
        className="contact-form-pointer__arrow"
      />
    </svg>
  );
}
