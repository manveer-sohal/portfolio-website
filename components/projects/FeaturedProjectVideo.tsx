"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type FeaturedProjectVideoProps = {
  webm: string;
  mp4: string;
  poster: string;
  label: string;
  className?: string;
  /** Eager-load the poster image only (never the video file). */
  priority?: boolean;
};

/**
 * Next.js-friendly featured demo:
 * - Optimized poster via next/image (lazy by default)
 * - Video sources attach only when near the viewport
 * - preload="none"; plays while visible, pauses when not
 * - Reduced-motion / Save-Data: poster only
 */
export function FeaturedProjectVideo({
  webm,
  mp4,
  poster,
  label,
  className,
  priority = false,
}: FeaturedProjectVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [posterOnly, setPosterOnly] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData = Boolean(
      (
        navigator as Navigator & {
          connection?: { saveData?: boolean };
        }
      ).connection?.saveData,
    );

    if (reduceMotion || saveData) {
      setPosterOnly(true);
      return;
    }

    // Start fetching slightly before the card enters the viewport.
    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadVideo(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: "320px 0px", threshold: 0 },
    );

    const playObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.3 },
    );

    loadObserver.observe(container);
    playObserver.observe(container);

    return () => {
      loadObserver.disconnect();
      playObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    if (isInView) {
      void video.play().catch(() => {
        /* autoplay blocked — poster remains visible underneath */
      });
    } else {
      video.pause();
    }
  }, [isInView, shouldLoadVideo]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden bg-[var(--project-surface,var(--surface))]",
        className,
      )}
    >
      <Image
        src={poster}
        alt={posterOnly ? label : ""}
        fill
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="object-cover object-top"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={75}
      />

      {shouldLoadVideo && !posterOnly ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-top"
          muted
          loop
          playsInline
          preload="none"
          aria-label={label}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
