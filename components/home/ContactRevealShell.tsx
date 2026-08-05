"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ContactRevealShellProps = {
  children: ReactNode;
  reveal: ReactNode;
};

/**
 * Sticky/fixed footer-reveal: upper homepage content covers Contact + Footer,
 * then scrolls away to uncover them at the bottom of the page.
 */
export function ContactRevealShell({
  children,
  reveal,
}: ContactRevealShellProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [revealHeight, setRevealHeight] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [uncovered, setUncovered] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
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
  }, [reduceMotion, reveal]);

  useEffect(() => {
    if (reduceMotion) return;

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
  }, [reduceMotion, revealHeight]);

  if (reduceMotion) {
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
