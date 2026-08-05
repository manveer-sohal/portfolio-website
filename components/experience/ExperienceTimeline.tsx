"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import type { ExperienceItem } from "@/data/types";

type ExperienceTimelineProps = {
  items: ExperienceItem[];
  highlightLimit?: number;
  headingLevel?: "h2" | "h3";
  previewLinks?: boolean;
};

/**
 * Left-rail date timeline with a scroll-linked fill line
 * (pattern adapted from https://aurorashi.com).
 */
export function ExperienceTimeline({
  items,
  highlightLimit,
  headingLevel = "h3",
  previewLinks = false,
}: ExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => {
      setHeight(node.getBoundingClientRect().height);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [items]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="experience-timeline">
      <div ref={contentRef} className="experience-timeline__list">
        {items.map((item) => (
          <div key={item.id} className="experience-timeline__row">
            <div className="experience-timeline__sticky">
              <div className="experience-timeline__dot" aria-hidden="true">
                <span className="experience-timeline__dot-inner" />
              </div>
              <div className="experience-timeline__dates">
                <p className="experience-timeline__year">{item.year}</p>
                {item.period ? (
                  <p className="experience-timeline__period">{item.period}</p>
                ) : null}
              </div>
            </div>

            <div className="experience-timeline__content">
              <div className="experience-timeline__dates-mobile">
                <p className="experience-timeline__year">{item.year}</p>
                {item.period ? (
                  <p className="experience-timeline__period">{item.period}</p>
                ) : null}
              </div>
              <ExperienceCard
                item={item}
                highlightLimit={highlightLimit}
                headingLevel={headingLevel}
                previewLinks={previewLinks}
                className="experience-card--timeline"
                hidePeriod
              />
            </div>
          </div>
        ))}

        <div
          className="experience-timeline__rail"
          style={{ height: `${height}px` }}
          aria-hidden="true"
        >
          <motion.div
            className="experience-timeline__rail-fill"
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
          />
        </div>
      </div>
    </div>
  );
}
