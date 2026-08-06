"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ContactRevealShellProps = {
  children: ReactNode;
  reveal: ReactNode;
};

/**
 * Sticky/fixed footer-reveal: upper homepage content covers Contact + Footer,
 * then scrolls away to uncover them at the bottom of the page.
 *
 * Disabled on small screens and reduced-motion — the fixed layer is taller
 * than a phone viewport, so the form intro/fields become unreachable.
 */
export function ContactRevealShell({
  children,
  reveal,
}: ContactRevealShellProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [revealHeight, setRevealHeight] = useState(0);
  const [staticReveal, setStaticReveal] = useState(true);
  const [uncovered, setUncovered] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 900px)");
    const sync = () => {
      setStaticReveal(motion.matches || !desktop.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (staticReveal) {
      setRevealHeight(0);
      setUncovered(true);
      return;
    }

    const node = revealRef.current;
    if (!node) return;

    const measure = () => {
      setRevealHeight(Math.ceil(node.getBoundingClientRect().height));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [staticReveal, reveal]);

  useEffect(() => {
    if (staticReveal) return;

    const update = () => {
      const content = contentRef.current;
      if (!content) return;
      const bottom = content.getBoundingClientRect().bottom;
      // Uncover once the content sheet has cleared most of the viewport bottom
      setUncovered(bottom <= window.innerHeight - 24);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [staticReveal, revealHeight]);

  if (staticReveal) {
    return (
      <>
        {children}
        {reveal}
      </>
    );
  }

  return (
    <div className="contact-reveal-root">
      <div
        ref={contentRef}
        className="page-content-layer"
        style={
          {
            "--contact-reveal-height": `${revealHeight}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
      <div
        ref={revealRef}
        className="contact-reveal-layer"
        // Prevent focusing / interacting with Contact while it is still covered
        inert={uncovered ? undefined : true}
      >
        {reveal}
      </div>
    </div>
  );
}
