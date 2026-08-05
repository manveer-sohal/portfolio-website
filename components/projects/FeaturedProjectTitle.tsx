"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type FeaturedProjectTitleProps = {
  id: string;
  name: string;
  href: string;
  color: string;
  headingClassName?: string;
  sizeClassName?: string;
};

/**
 * Project name with a theme-coloured underline that slides in on scroll.
 */
export function FeaturedProjectTitle({
  id,
  name,
  href,
  color,
  headingClassName,
  sizeClassName = "text-3xl md:text-4xl lg:text-5xl",
}: FeaturedProjectTitleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      node.classList.add("is-underlined");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-underlined");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.55, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="featured-title-block min-w-0">
      <h3
        id={id}
        className={cn(
          "project-theme__name font-semibold tracking-tight",
          sizeClassName,
          headingClassName,
        )}
        style={{ color }}
      >
        <Link
          href={href}
          className="hover:opacity-90"
          style={{ color: "inherit" }}
        >
          {name}
        </Link>
      </h3>
      <span
        className="featured-title-line"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
    </div>
  );
}
