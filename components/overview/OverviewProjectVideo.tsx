"use client";

import { useEffect, useRef } from "react";

type OverviewProjectVideoProps = {
  webm: string;
  mp4: string;
  poster: string;
};

export function OverviewProjectVideo({
  webm,
  mp4,
  poster,
}: OverviewProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let isVisible = false;
    const syncPlayback = () => {
      if (motionPreference.matches || !isVisible) {
        element.pause();
        if (motionPreference.matches) element.currentTime = 0;
      } else {
        void element.play().catch(() => undefined);
      }
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncPlayback();
      },
      { rootMargin: "120px 0px" },
    );

    visibilityObserver.observe(element);
    motionPreference.addEventListener("change", syncPlayback);
    return () => {
      visibilityObserver.disconnect();
      motionPreference.removeEventListener("change", syncPlayback);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="overview-project-media__asset"
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
