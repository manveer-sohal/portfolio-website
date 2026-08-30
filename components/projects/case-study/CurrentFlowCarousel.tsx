"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import type { GarmentFlowCarouselSlide } from "@/data/almaari-garment-ingestion";
import { cn } from "@/lib/utils";

type CurrentFlowCarouselProps = {
  slides: GarmentFlowCarouselSlide[];
};

const carouselImageSizes =
  "(max-width: 767px) calc(100vw - 2.5rem), 46rem";

function createResponsiveSrcSet(
  basePath: string,
  extension: "avif" | "webp",
  originalWidth: number,
) {
  return [
    `${basePath}-640.${extension} 640w`,
    `${basePath}-1200.${extension} 1200w`,
    `${basePath}.${extension} ${originalWidth}w`,
  ].join(", ");
}

export function CurrentFlowCarousel({ slides }: CurrentFlowCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  if (!activeSlide) return null;

  function showSlide(nextIndex: number) {
    const normalizedIndex = (nextIndex + slides.length) % slides.length;
    setActiveIndex(normalizedIndex);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(activeIndex + 1);
    }
  }

  return (
    <section
      className="engineering-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Current garment upload flow"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <article
        key={activeSlide.id}
        className="engineering-carousel__slide"
        role="group"
        aria-roledescription="slide"
        aria-label={`${activeIndex + 1} of ${slides.length}`}
      >
        <div className="engineering-carousel__copy" aria-live="polite">
          <p className="engineering-carousel__step">
            {activeSlide.step} · {activeIndex + 1} of {slides.length}
          </p>
          <h3>{activeSlide.title}</h3>
          <p className="engineering-carousel__body">{activeSlide.body}</p>
          <ul className="engineering-carousel__callouts">
            {activeSlide.callouts.map((callout) => (
              <li key={callout.number}>
                <span className="engineering-carousel__callout-number">
                  {callout.number}
                </span>
                <span>{callout.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <figure className="engineering-carousel__media">
          <picture>
            <source
              type="image/avif"
              srcSet={createResponsiveSrcSet(
                activeSlide.image.optimizedBase,
                "avif",
                activeSlide.image.width,
              )}
              sizes={carouselImageSizes}
            />
            <source
              type="image/webp"
              srcSet={createResponsiveSrcSet(
                activeSlide.image.optimizedBase,
                "webp",
                activeSlide.image.width,
              )}
              sizes={carouselImageSizes}
            />
            <Image
              src={activeSlide.image.src}
              alt={activeSlide.image.alt}
              width={activeSlide.image.width}
              height={activeSlide.image.height}
              sizes={carouselImageSizes}
            />
          </picture>
        </figure>
      </article>

      <div className="engineering-carousel__navigation">
        <div className="engineering-carousel__dots" aria-label="Choose a slide">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={cn(index === activeIndex && "is-active")}
              aria-label={`Show ${slide.step}: ${slide.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>
        <div className="engineering-carousel__buttons">
          <button
            type="button"
            onClick={() => showSlide(activeIndex - 1)}
            aria-label="Previous slide"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => showSlide(activeIndex + 1)}
            aria-label="Next slide"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
