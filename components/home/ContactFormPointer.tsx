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
  const lineDelayTimer = useRef<number | null>(null);
  const drawRaf = useRef<number | null>(null);
  const wasRevealed = useRef(false);

  const [path, setPath] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [tip, setTip] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [lineActive, setLineActive] = useState(false);
  const [arrowActive, setArrowActive] = useState(false);
  const [near, setNear] = useState(false);

  const desktop = useDesktopTealRails();
  const reduceMotion = usePrefersReducedMotion();

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

  const reset = useCallback(() => {
    clearDelay();
    clearDraw();
    wasRevealed.current = false;
    setLineActive(false);
    setArrowActive(false);
    const pathEl = pathRef.current;
    if (pathEl) applyStrokeDash(pathEl, 0, pathLengthRef);
  }, [clearDelay, clearDraw]);

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

      // Far-left page rail (matches the red annotation). Stay clear of intro copy.
      const EDGE_X = 20;
      const TEXT_CLEAR = 22;
      const introLeft = introRect.left - sectionRect.left;
      const introBottom = introRect.bottom - sectionRect.top;
      const startX = Math.round(Math.min(EDGE_X, introLeft - TEXT_CLEAR));

      // Not enough left gutter → hide rather than overlap text
      if (startX < 10 || introLeft - startX < TEXT_CLEAR) {
        setReady(false);
        setPath("");
        return;
      }

      // Drop from under the Contact Me banner, then turn below intro copy into the form
      const startY = 8;
      const formMidY =
        formRect.top - sectionRect.top + formRect.height * 0.55;
      const turnY = Math.max(formMidY, introBottom + TEXT_CLEAR);
      const formLeft = formRect.left - sectionRect.left;
      // Tip stops short of the form (20–60px gap, scales with available span)
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

      section.style.setProperty("--flow-line-color", "var(--accent)");
      section.style.setProperty("--flow-line-width", "2px");
      section.style.setProperty("--flow-contact-start-x", `${startX}px`);
      section.style.setProperty("--flow-contact-end-x", `${endX}px`);

      pathLengthRef.current = 0;
      setPath(d);
      setTip({ x: endX, y: endY });
      setSize({ w, h });
      setReady(true);

      requestAnimationFrame(() => {
        const pathEl = pathRef.current;
        if (!pathEl) return;
        pathLengthRef.current = readGeometricLength(pathEl);
        applyStrokeDash(
          pathEl,
          reduceMotion || lineActive ? 1 : 0,
          pathLengthRef,
        );
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
  }, [desktop, reduceMotion, lineActive]);

  useEffect(() => {
    if (!ready || !desktop || reduceMotion || !near) {
      if (!near || !desktop) reset();
      if (reduceMotion && ready && desktop) {
        setLineActive(true);
        setArrowActive(true);
        const pathEl = pathRef.current;
        if (pathEl) applyStrokeDash(pathEl, 1, pathLengthRef);
      }
      return;
    }

    const evaluate = () => {
      const vh = window.innerHeight;
      let revealed = false;
      const content = contentLayerRef.current;
      const section = sectionRef.current;

      if (!content) {
        if (section) {
          revealed = section.getBoundingClientRect().top < vh * 0.52;
        }
      } else {
        revealed = content.getBoundingClientRect().bottom < vh * 0.5;
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
    };

    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => {
      window.removeEventListener("scroll", evaluate);
      clearDelay();
    };
  }, [ready, desktop, reduceMotion, near, reset, clearDelay]);

  // Manual draw animation (no Framer pathLength attribute)
  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl || !lineActive) return;

    if (reduceMotion) {
      applyStrokeDash(pathEl, 1, pathLengthRef);
      setArrowActive(true);
      return;
    }

    clearDraw();
    setArrowActive(false);
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / LINE_DRAW_MS);
      applyStrokeDash(pathEl, easeOut(t), pathLengthRef);
      if (t < 1) {
        drawRaf.current = window.requestAnimationFrame(tick);
      } else {
        drawRaf.current = null;
        setArrowActive(true);
      }
    };
    drawRaf.current = window.requestAnimationFrame(tick);
    return () => clearDraw();
  }, [lineActive, reduceMotion, clearDraw, path]);

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
