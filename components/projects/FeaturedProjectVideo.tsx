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

const LOAD_ROOT_MARGIN = "300px 0px";
const PLAY_THRESHOLD = 0.4;
const UNLOAD_DELAY_MS = 2000;

function isBenignPlayError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const name = "name" in error ? String((error as { name?: string }).name) : "";
  return (
    name === "AbortError" ||
    name === "NotAllowedError" ||
    /interrupted|aborted|play\(\)/i.test(error.message)
  );
}

/**
 * Looping featured demo (webm/mp4) — GIF-like preview for featured projects.
 *
 * Media lifecycle:
 * - unloaded: poster only; `<video>` unmounted (decoder released)
 * - loaded: sources attached, paused
 * - playing: meaningfully visible + document active
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
  const unloadTimerRef = useRef<number | null>(null);

  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [posterOnly, setPosterOnly] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const [mediaMounted, setMediaMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const clearUnloadTimer = () => {
    if (unloadTimerRef.current !== null) {
      window.clearTimeout(unloadTimerRef.current);
      unloadTimerRef.current = null;
    }
  };

  // Reduced motion / Save-Data → poster only
  useEffect(() => {
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
    }
  }, []);

  // Intersection + visibility observers
  useEffect(() => {
    if (posterOnly) return;
    const container = containerRef.current;
    if (!container) return;

    const loadObserver = new IntersectionObserver(
      (entries) => {
        setNear(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin: LOAD_ROOT_MARGIN, threshold: 0 },
    );

    const playObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setVisible(
          Boolean(
            entry?.isIntersecting &&
              (entry.intersectionRatio ?? 0) >= PLAY_THRESHOLD,
          ),
        );
      },
      { threshold: [0, PLAY_THRESHOLD, 0.6, 1] },
    );

    const onVisibility = () => setDocHidden(document.hidden);

    setDocHidden(document.hidden);
    loadObserver.observe(container);
    playObserver.observe(container);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearUnloadTimer();
      loadObserver.disconnect();
      playObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [posterOnly]);

  const shouldMount =
    !posterOnly || manualPlay ? near || visible || manualPlay : false;
  const shouldPlay =
    mediaMounted &&
    !docHidden &&
    (manualPlay || visible || (active && near));


  // Mount / delayed unmount media element
  useEffect(() => {
    if (posterOnly && !manualPlay) {
      clearUnloadTimer();
      setMediaMounted(false);
      setIsPlaying(false);
      return;
    }

    if (shouldMount) {
      clearUnloadTimer();
      setMediaMounted(true);
      return;
    }

    clearUnloadTimer();
    unloadTimerRef.current = window.setTimeout(() => {
      unloadTimerRef.current = null;
      setMediaMounted(false);
      setIsPlaying(false);
    }, UNLOAD_DELAY_MS);

    return () => clearUnloadTimer();
  }, [shouldMount, posterOnly, manualPlay]);

  // Play / pause when mounted
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mediaMounted) return;

    if (!shouldPlay) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const tryPlay = () => {
      void video
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          setIsPlaying(false);
          if (
            !isBenignPlayError(error) &&
            process.env.NODE_ENV !== "production"
          ) {
            console.warn("[FeaturedProjectVideo] play failed", error);
          }
        });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
      return () => video.removeEventListener("canplay", tryPlay);
    }
  }, [mediaMounted, shouldPlay, webm, mp4]);

  // Unmount cleanup
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      clearUnloadTimer();
      video?.pause();
    };
  }, []);

  const startManualPreview = () => {
    setPosterOnly(false);
    setManualPlay(true);
    setMediaMounted(true);
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

      {mediaMounted ? (
        <video
          ref={videoRef}
          className="absolute inset-0 z-[1] h-full w-full object-cover"
          style={{ objectPosition }}
          muted
          loop
          playsInline
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
