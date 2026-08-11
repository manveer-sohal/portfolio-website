"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { TealLineArrow } from "@/components/ui/TealLineArrow";
import { subscribeBridgeProgress } from "@/lib/animation/bridgeProgress";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/data/types";

type ExperienceTimelineProps = {
  items: ExperienceItem[];
  highlightLimit?: number;
  headingLevel?: "h2" | "h3";
  previewLinks?: boolean;
  /**
   * When true (homepage only), the rail tip waits for the featured→experience
   * bridge to finish. Standalone /experience must leave this unset/false.
   */
  enableHomepageBridge?: boolean;
};

function TimelineBranch({
  fillHeight,
  start,
}: {
  fillHeight: MotionValue<number>;
  start: number;
}) {
  const progress = useTransform(fillHeight, (height) => {
    if (start <= 0) return height > 8 ? 1 : 0;
    const drawWindow = 40;
    return Math.min(1, Math.max(0, (height - start) / drawWindow));
  });

  const lineProgress = useTransform(progress, (p) => Math.max(0, p * 0.9));
  const arrowOpacity = useTransform(progress, (p) => (p > 0.08 ? 1 : 0));
  const tipLeft = useTransform(lineProgress, (p) => `${p * 100}%`);

  return (
    <span className="experience-timeline__branch-wrap" aria-hidden="true">
      <motion.span
        className="experience-timeline__branch"
        style={{ scaleX: lineProgress }}
      />
      <motion.span
        className="experience-timeline__branch-tip"
        style={{ left: tipLeft, opacity: arrowOpacity }}
      >
        <TealLineArrow direction="right" className="teal-line-arrow--on-tip" />
      </motion.span>
    </span>
  );
}

/**
 * Left-rail date timeline with a scroll-linked fill line that
 * branches into each project as you scroll beside it.
 */
export function ExperienceTimeline({
  items,
  highlightLimit,
  headingLevel = "h3",
  previewLinks = false,
  enableHomepageBridge = false,
}: ExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(-1);

  const [height, setHeight] = useState(0);
  const [railTop, setRailTop] = useState(0);
  const [rowStarts, setRowStarts] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const bridgeProgress = useMotionValue(enableHomepageBridge ? 0 : 1);

  useEffect(() => {
    if (!enableHomepageBridge) {
      bridgeProgress.set(1);
      return;
    }
    return subscribeBridgeProgress((progress) => {
      bridgeProgress.set(progress);
    });
  }, [enableHomepageBridge, bridgeProgress]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => {
      const listTop = node.getBoundingClientRect().top;
      const listHeight = node.getBoundingClientRect().height;
      setHeight(listHeight);

      const firstDot = rowRefs.current[0]?.querySelector(
        ".experience-timeline__dot",
      ) as HTMLElement | null;
      if (firstDot) {
        const dotRect = firstDot.getBoundingClientRect();
        setRailTop(dotRect.top + dotRect.height / 2 - listTop);
      } else {
        setRailTop(0);
      }

      setRowStarts(
        rowRefs.current.map((row) => {
          if (!row) return 0;
          const card = row.querySelector(".experience-card--timeline");
          const target = card ?? row;
          const rect = target.getBoundingClientRect();
          return rect.top - listTop + rect.height / 2;
        }),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 45%"],
  });

  const railHeight = Math.max(height - railTop, 0);
  const heightTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, railHeight],
  );
  // Hold teal fill until Featured→Experience bridge arrives so the join stays continuous
  const gatedHeight = useTransform(
    [heightTransform, bridgeProgress],
    ([h, bp]) => {
      const heightValue = h as number;
      const bridgeValue = bp as number;
      if (enableHomepageBridge && bridgeValue < 0.92) return 0;
      return heightValue;
    },
  );
  const tipTransform = useTransform(gatedHeight, (h) => h + railTop);
  const tipOpacity = useTransform(gatedHeight, (h) => {
    if (h <= 8 || railHeight <= 0) return 0;
    return h >= railHeight - 2 ? 0 : 1;
  });

  useMotionValueEvent(tipTransform, "change", (latest) => {
    if (!rowStarts.length) {
      if (activeIndexRef.current !== -1) {
        activeIndexRef.current = -1;
        setActiveIndex(-1);
      }
      return;
    }
    let next = -1;
    for (let i = 0; i < rowStarts.length; i += 1) {
      if (latest >= rowStarts[i]) next = i;
    }
    if (next !== activeIndexRef.current) {
      activeIndexRef.current = next;
      setActiveIndex(next);
    }
  });

  return (
    <div ref={containerRef} className="experience-timeline">
      <div ref={contentRef} className="experience-timeline__list">
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(node) => {
              rowRefs.current[index] = node;
            }}
            className={cn(
              "experience-timeline__row",
              activeIndex === index && "is-active",
              activeIndex > index && "is-passed",
            )}
          >
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
              <div className="experience-timeline__card-wrap">
                <TimelineBranch
                  fillHeight={tipTransform}
                  start={rowStarts[index] ?? 0}
                />
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
          </div>
        ))}

        <div
          className="experience-timeline__rail"
          style={{
            top: `${railTop}px`,
            height: `${railHeight}px`,
          }}
          aria-hidden="true"
        >
          <motion.div
            className="experience-timeline__rail-fill"
            style={{
              height: gatedHeight,
            }}
          >
            <motion.span
              className="experience-timeline__rail-tip"
              style={{ opacity: tipOpacity }}
            >
              <TealLineArrow direction="down" />
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
