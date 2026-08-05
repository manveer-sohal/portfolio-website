"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TealLineArrow } from "@/components/ui/TealLineArrow";
import { FeaturedProjectSection } from "@/components/projects/FeaturedProjectSection";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/types";

type FeaturedProjectsProps = {
  projects: Project[];
};

function FeaturedBranch({
  fillHeight,
  start,
  side,
}: {
  fillHeight: MotionValue<number>;
  start: number;
  side: "left" | "right";
}) {
  const progress = useTransform(fillHeight, (height) => {
    if (start <= 0) return height > 12 ? 1 : 0;
    const drawWindow = 40;
    return Math.min(1, Math.max(0, (height - start) / drawWindow));
  });

  // Stop short of the media so the arrow doesn't kiss the frame
  const lineProgress = useTransform(progress, (p) => Math.max(0, p * 0.88));
  const arrowOpacity = useTransform(progress, (p) => (p > 0.08 ? 1 : 0));
  const tipLeft = useTransform(lineProgress, (p) =>
    side === "left" ? `${(1 - p) * 100}%` : `${p * 100}%`,
  );

  return (
    <span
      className={cn(
        "featured-rail__branch-wrap",
        side === "left"
          ? "featured-rail__branch-wrap--left"
          : "featured-rail__branch-wrap--right",
      )}
      aria-hidden="true"
    >
      <motion.span
        className={cn(
          "featured-rail__branch",
          side === "left"
            ? "featured-rail__branch--left"
            : "featured-rail__branch--right",
        )}
        style={{ scaleX: lineProgress }}
      />
      <motion.span
        className="featured-rail__branch-tip"
        style={{ left: tipLeft, opacity: arrowOpacity }}
      >
        <TealLineArrow
          direction={side === "left" ? "left" : "right"}
          className="teal-line-arrow--on-tip"
        />
      </motion.span>
    </span>
  );
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [height, setHeight] = useState(0);
  const [itemBottoms, setItemBottoms] = useState<number[]>([]);
  const [branchTops, setBranchTops] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const listTop = list.getBoundingClientRect().top;
      setHeight(list.getBoundingClientRect().height);
      const bottoms: number[] = [];
      const tops: number[] = [];
      itemRefs.current.forEach((item) => {
        if (!item) {
          bottoms.push(0);
          tops.push(0);
          return;
        }
        const media = item.querySelector(
          ".featured-editorial__media-shell",
        ) as HTMLElement | null;
        const target = media ?? item;
        const rect = target.getBoundingClientRect();
        const mid = rect.height / 2;
        const listOffset = rect.top - listTop;
        const itemOffset = rect.top - item.getBoundingClientRect().top;
        bottoms.push(listOffset + mid);
        tops.push(itemOffset + mid);
      });
      setItemBottoms(bottoms);
      setBranchTops(tops);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [projects]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 88%", "end 68%"],
  });

  const heightTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 0.8, 1],
    [0, height * 0.45, height * 0.8, height],
  );
  const tipOpacity = useTransform(heightTransform, (h) => {
    // Stay solid through the rail; hard-cut only once the bridge takes over
    if (h <= 32 || height <= 0) return 0;
    return h >= height - 2 ? 0 : 1;
  });

  useMotionValueEvent(heightTransform, "change", (latest) => {
    if (!itemBottoms.length) {
      setActiveIndex(-1);
      return;
    }
    let next = -1;
    for (let i = 0; i < itemBottoms.length; i += 1) {
      if (latest >= itemBottoms[i]) next = i;
    }
    setActiveIndex(next);
  });

  return (
    <section
      id="projects"
      className="featured-section section-space border-y border-border-subtle bg-section"
      aria-labelledby="featured-heading"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="featured-heading"
            eyebrow="Featured Projects"
            title="Projects I'm proud of"
            description="My projects I built to solve problems. Each built end to end with real engineering ownership."
            className="mb-0"
          />
        </Reveal>

        <div ref={containerRef} className="featured-rail">
          <div ref={listRef} className="featured-rail__list">
            {projects.map((project, index) => {
              const mediaSide = index % 2 === 0 ? "left" : "right";
              return (
                <div
                  key={project.slug}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  className={cn(
                    "featured-rail__item",
                    activeIndex === index && "is-active",
                    activeIndex > index && "is-passed",
                  )}
                  style={
                    {
                      "--featured-branch-top": `${branchTops[index] ?? 0}px`,
                    } as CSSProperties
                  }
                >
                  <FeaturedBranch
                    fillHeight={heightTransform}
                    start={itemBottoms[index] ?? 0}
                    side={mediaSide}
                  />
                  <Reveal variant="feature">
                    <FeaturedProjectSection
                      project={project}
                      priority={index === 0}
                      mediaSide={mediaSide}
                    />
                  </Reveal>
                </div>
              );
            })}

            <div
              className="featured-rail__track"
              style={{ height: `${height}px` }}
              aria-hidden="true"
            >
              <motion.div
                className="featured-rail__fill"
                style={{
                  height: heightTransform,
                }}
              >
                <motion.span style={{ opacity: tipOpacity }}>
                  <TealLineArrow direction="down" />
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
