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
  /** Soft product-window chrome (Almaari showcase). */
  framed?: boolean;
};

/**
 * Next.js-friendly featured demo:
 * - Optimized poster via next/image (lazy by default)
 * - Video sources attach only when near the viewport
 * - preload="none"; plays while visible, pauses when not
 * - Reduced-motion / Save-Data: poster + optional Play Preview
 */
export function FeaturedProjectVideo({
  webm,
  mp4,
  poster,
  label,
  className,
  priority = false,
  framed = false,
}: FeaturedProjectVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [posterOnly, setPosterOnly] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);

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
      { threshold: 0.35 },
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

    if (isInView || manualPlay) {
      void video.play().catch(() => {
        /* autoplay blocked — poster remains visible underneath */
      });
    } else {
      video.pause();
    }
  }, [isInView, shouldLoadVideo, manualPlay]);

  const startManualPreview = () => {
    setPosterOnly(false);
    setShouldLoadVideo(true);
    setManualPlay(true);
  };

  const media = (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full min-h-0 w-full overflow-hidden bg-[var(--project-surface-strong,#fff)]",
        !framed && className,
      )}
    >
      <Image
        src={poster}
        alt={posterOnly && !manualPlay ? label : ""}
        fill
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="object-cover object-top"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={75}
      />

      {shouldLoadVideo && (!posterOnly || manualPlay) ? (
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

      {posterOnly && !manualPlay ? (
        <button
          type="button"
          className="absolute bottom-3 left-3 rounded-[12px] border border-[var(--project-border,#d8d4cc)] bg-[var(--project-surface-strong,#fff)] px-3 py-2 text-sm font-semibold text-[var(--project-text,#273157)] shadow-[0_2px_12px_rgba(39,49,87,0.08)] transition-colors hover:bg-[var(--project-primary-muted,#e8ebf5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--project-primary,#4f5d9a)]"
          onClick={startManualPreview}
        >
          Play Preview
        </button>
      ) : null}
    </div>
  );

  if (!framed) {
    return media;
  }

  return (
    <div className={cn("almaari-window", className)}>
      <div className="almaari-window__chrome" aria-hidden="true">
        <span className="almaari-window__dot" />
        <span className="almaari-window__dot" />
        <span className="almaari-window__dot" />
        <span className="almaari-window__url">almaari.app</span>
      </div>
      {media}
    </div>
  );
}
