import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  align?: "left" | "center";
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
  align = "left",
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-2 font-mono text-sm font-medium uppercase tracking-[0.14em]",
            eyebrowClassName ?? "text-muted",
          )}
          data-featured-eyebrow=""
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className={cn(
          "text-3xl font-semibold tracking-tight text-foreground md:text-4xl",
          titleClassName,
        )}
        data-featured-title=""
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 text-lg leading-relaxed text-muted-strong md:text-xl",
            descriptionClassName,
          )}
          data-featured-description=""
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
