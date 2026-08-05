"use client";

import { useId, useState } from "react";
import type { ExpandablePreview } from "@/data/types";

type ExpandableDetailsProps = {
  preview: ExpandablePreview;
};

export function ExpandableDetails({ preview }: ExpandableDetailsProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div
      className="mt-4 border-t pt-4"
      style={{ borderColor: "var(--project-border, var(--border-subtle))" }}
    >
      <button
        type="button"
        className="text-base font-medium transition-colors"
        style={{ color: "var(--project-primary, var(--accent))" }}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Hide technical highlights" : "More details"}
      </button>
      {open ? (
        <div
          id={panelId}
          className="mt-3 space-y-3 text-base leading-relaxed"
          style={{ color: "var(--project-text-secondary, var(--muted-strong))" }}
        >
          <div>
            <p
              className="font-medium"
              style={{ color: "var(--project-text, var(--muted-strong))" }}
            >
              Challenge
            </p>
            <p>{preview.challenge}</p>
          </div>
          <div>
            <p
              className="font-medium"
              style={{ color: "var(--project-text, var(--muted-strong))" }}
            >
              Decision
            </p>
            <p>{preview.decision}</p>
          </div>
          <div>
            <p
              className="font-medium"
              style={{ color: "var(--project-text, var(--muted-strong))" }}
            >
              Outcomes
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
