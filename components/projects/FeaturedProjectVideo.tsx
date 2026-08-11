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
  /** CSS object-position for poster + video. */
  objectPosition?: string;
  /** When true, keep attempting playback (e.g. active featured rail item). */
  active?: boolean;
};

/**
 * Looping featured demo (webm/mp4) — GIF-like preview for featured projects.
 * - Optimized poster via next/image
 * - Sources attach near the viewport; plays while visible
 * - Reduced-motion / Save-Data: poster + optional Play Preview
 */
export function FeaturedProjectVideo({
  webm,
  mp4,
  poster,
  label,
  className,
  priority = false,
  objectPosition = "top center",
  active = false,
}: FeaturedProjectVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [posterOnly, setPosterOnly] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
      { rootMargin: "480px 0px", threshold: 0 },
    );

    const playObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    loadObserver.observe(container);
    playObserver.observe(container);

    return () => {
      loadObserver.disconnect();
      playObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (active && !posterOnly) {
      setShouldLoadVideo(true);
    }
  }, [active, posterOnly]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    video.load();

    const shouldPlay = isInView || manualPlay || active;
    if (!shouldPlay) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const tryPlay = () => {
      void video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
      return () => video.removeEventListener("canplay", tryPlay);
    }
  }, [isInView, shouldLoadVideo, manualPlay, active]);

  const startManualPreview = () => {
    setPosterOnly(false);
    setShouldLoadVideo(true);
    setManualPlay(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full min-h-0 w-full overflow-hidden bg-[var(--project-surface-strong,#fff)]",
        className,
      )}
    >
      <Image
        src={poster}
        alt={posterOnly && !manualPlay ? label : ""}
        fill
        sizes="(max-width: 1024px) 100vw, 55vw"
        className={cn(
          "object-cover transition-opacity duration-300",
          isPlaying ? "opacity-0" : "opacity-100",
        )}
        style={{ objectPosition }}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={75}
      />

      {shouldLoadVideo && (!posterOnly || manualPlay) ? (
        <video
          ref={videoRef}
          className="absolute inset-0 z-[1] h-full w-full object-cover"
          style={{ objectPosition }}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster={poster}
          aria-label={label}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      ) : null}

      {posterOnly && !manualPlay ? (
        <button
          type="button"
          className="absolute bottom-3 left-3 z-[2] rounded-[12px] border border-[var(--project-border,#d8d4cc)] bg-[var(--project-surface-strong,#fff)] px-3 py-2 text-sm font-semibold text-[var(--project-text,#273157)] shadow-[0_2px_12px_rgba(39,49,87,0.08)] transition-colors hover:bg-[var(--project-primary-muted,#e8ebf5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--project-primary,#4f5d9a)]"
          onClick={startManualPreview}
        >
          Play Preview
        </button>
      ) : null}
    </div>
  );
}
