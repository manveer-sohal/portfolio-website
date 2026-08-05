import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FeaturedMediaWindowProps = {
  url: string;
  children: ReactNode;
  className?: string;
};

/**
 * Browser-style chrome above featured media — colours inherit from project theme vars.
 */
export function FeaturedMediaWindow({
  url,
  children,
  className,
}: FeaturedMediaWindowProps) {
  return (
    <div className={cn("featured-window", className)}>
      <div className="featured-window__chrome" aria-hidden="true">
        <span className="featured-window__dot" />
        <span className="featured-window__dot" />
        <span className="featured-window__dot" />
        <span className="featured-window__url">{url}</span>
      </div>
      <div className="featured-window__body">{children}</div>
    </div>
  );
}
