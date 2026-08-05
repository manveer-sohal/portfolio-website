"use client";

import { useId, useState } from "react";
import type { ExpandablePreview } from "@/data/types";
import { cn } from "@/lib/utils";

type ExpandableDetailsProps = {
  preview: ExpandablePreview;
  label?: string;
  className?: string;
};

export function ExpandableDetails({
  preview,
  label = "Technical highlights",
  className,
}: ExpandableDetailsProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div
      className={cn("border-t pt-4", className)}
      style={{ borderColor: "var(--project-border, var(--border-subtle))" }}
    >
      <button
        type="button"
        className="group inline-flex min-h-11 items-center gap-2 text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--project-primary,var(--accent))]"
        style={{ color: "var(--project-primary, var(--accent))" }}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? `Hide ${label.toLowerCase()}` : label}</span>
        <svg
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-180",
          )}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open ? (
        <div
          id={panelId}
          className="mt-3 space-y-3 text-base leading-relaxed"
          style={{ color: "var(--project-text-secondary, var(--muted-strong))" }}
        >
          <div>
            <p
              className="font-semibold"
              style={{ color: "var(--project-text, var(--muted-strong))" }}
            >
              Challenge
            </p>
            <p className="mt-1">{preview.challenge}</p>
          </div>
          <div>
            <p
              className="font-semibold"
              style={{ color: "var(--project-text, var(--muted-strong))" }}
            >
              Decision
            </p>
            <p className="mt-1">{preview.decision}</p>
          </div>
          <div>
            <p
              className="font-semibold"
              style={{ color: "var(--project-text, var(--muted-strong))" }}
            >
              Result
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {preview.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
