"use client";

import { cn } from "@/lib/utils";

type TealLineArrowProps = {
  direction: "down" | "left" | "right" | "up";
  className?: string;
};

/**
 * Triangle tip for scroll-linked teal rails / branches.
 * Place at the growing end of a line so it rides the tip.
 */
export function TealLineArrow({ direction, className }: TealLineArrowProps) {
  return (
    <span
      className={cn(
        "teal-line-arrow",
        `teal-line-arrow--${direction}`,
        className,
      )}
      aria-hidden="true"
    />
  );
}
