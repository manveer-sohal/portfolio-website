"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CurrentProjectMedia } from "@/data/current-projects";
import { cn } from "@/lib/utils";

type CurrentProjectCarouselProps = {
  media: CurrentProjectMedia[];
  projectName: string;
};

const AUTO_ADVANCE_MS = 5000;

export function CurrentProjectCarousel({
  media,
  projectName,
}: CurrentProjectCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || isHovered || !isVisible || media.length < 2) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (!document.hidden) {
        timer = setInterval(
          () => setActiveIndex((index) => (index + 1) % media.length),
          AUTO_ADVANCE_MS,
        );
      }
    };
    const handleVisibility = () => {
      if (timer) clearInterval(timer);
      start();
    };
    start();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isHovered, isVisible, media.length, reduceMotion]);

  useEffect(() => {
    if (!isVisible || media.length < 2) return;
    for (const slide of media) {
      const preload = new window.Image();
      preload.src = slide.src;
    }
  }, [isVisible, media]);

  if (!media.length) return null;

  return (
    <div
      ref={rootRef}
      className="current-project-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${projectName} product previews`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsHovered(false);
      }}
    >
      {media.map((slide, index) => (
        <figure
          key={slide.src}
          className={cn(
            "current-project-carousel__slide",
            index === activeIndex && "is-active",
          )}
          aria-hidden={index !== activeIndex}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            unoptimized
            sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1200px) 48vw, 40rem"
            priority={index === 0}
          />
        </figure>
      ))}
      {media.length > 1 ? (
        <div className="current-project-carousel__dots" aria-label="Choose a preview">
          {media.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={cn(index === activeIndex && "is-active")}
              aria-label={`Show preview ${index + 1} of ${media.length}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
