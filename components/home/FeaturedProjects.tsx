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

/** Mid-Y of `el` relative to `ancestor`, using layout offsets (ignores CSS transforms). */
function offsetMidYWithin(el: HTMLElement, ancestor: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    top += node.offsetTop;
    const parent = node.offsetParent as HTMLElement | null;
    if (!parent || (parent !== ancestor && !ancestor.contains(parent))) {
      break;
    }
    node = parent;
  }
  return top + el.offsetHeight / 2;
}

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

  // Full length — wrap width already ends ~5px before the media (plus tip overhang)
  const lineProgress = progress;
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
  const [branchWidths, setBranchWidths] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    /** Arrow triangle extends ~7px past the branch end toward the media. */
    const TIP_OVERHANG_PX = 7;
    /** Keep the arrow tip this far from the media frame. */
    const MEDIA_GAP_PX = 5;

    const measure = () => {
      const listRect = list.getBoundingClientRect();
      const listTop = listRect.top;
      const centerX = listRect.left + listRect.width / 2;
      setHeight(listRect.height);
      const bottoms: number[] = [];
      const tops: number[] = [];
      const widths: number[] = [];

      itemRefs.current.forEach((item, index) => {
        if (!item) {
          bottoms.push(0);
          tops.push(0);
          widths.push(0);
          return;
        }

        // Prefer the framed image; fall back to the media shell.
        // Use offset geometry (ignores Reveal translateY) so the branch
        // always targets the vertical middle of the card.
        const media =
          (item.querySelector(
            ".featured-editorial__media",
          ) as HTMLElement | null) ??
          (item.querySelector(
            ".featured-editorial__media-shell",
          ) as HTMLElement | null);
        const target = media ?? item;

        const midFromItem = offsetMidYWithin(target, item);
        const itemTop = item.getBoundingClientRect().top;
        bottoms.push(itemTop - listTop + midFromItem);
        tops.push(midFromItem);

        const mediaSide = index % 2 === 0 ? "left" : "right";
        // Horizontal edge still from live rect (X is unaffected by translateY)
        const rect = target.getBoundingClientRect();
        const spanToMedia =
          mediaSide === "left"
            ? centerX - rect.right
            : rect.left - centerX;
        widths.push(
          Math.max(0, spanToMedia - MEDIA_GAP_PX - TIP_OVERHANG_PX),
        );
      });

      setItemBottoms(bottoms);
      setBranchTops(tops);
      setBranchWidths(widths);
    };

    measure();
    requestAnimationFrame(measure);

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    itemRefs.current.forEach((item) => {
      if (!item) return;
      observer.observe(item);
      const media = item.querySelector(".featured-editorial__media-shell");
      if (media) observer.observe(media);
    });

    // Reveal uses transform (not size), so remeasure when cards become visible
    const reveals = list.querySelectorAll(".reveal");
    const mutationObservers: MutationObserver[] = [];
    reveals.forEach((reveal) => {
      const mo = new MutationObserver(measure);
      mo.observe(reveal, { attributes: true, attributeFilter: ["class"] });
      mutationObservers.push(mo);
      reveal.addEventListener("transitionend", measure);
    });

    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      mutationObservers.forEach((mo) => mo.disconnect());
      reveals.forEach((reveal) => {
        reveal.removeEventListener("transitionend", measure);
      });
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
            description={
              <>
                Projects I built to solve real problems I faced. Each with a{" "}
                <span className="text-accent font-bold">case study</span>.
              </>
            }
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
                      "--featured-branch-width": `${branchWidths[index] ?? 0}px`,
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
                      mediaSide={mediaSide}
                      priority={index === 0}
                      active={activeIndex === index}
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
