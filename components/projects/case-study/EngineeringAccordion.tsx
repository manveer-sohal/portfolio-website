"use client";

import { useId, useState, type ReactNode } from "react";

export function EngineeringAccordion({
  eyebrow,
  title,
  summary,
  children,
}: {
  eyebrow?: string;
  title: string;
  summary?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <article className="engineering-accordion">
      <button
        type="button"
        className="engineering-accordion__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>
          {eyebrow ? <span className="engineering-accordion__eyebrow">{eyebrow}</span> : null}
          <span className="engineering-accordion__title">{title}</span>
          {summary ? <span className="engineering-accordion__summary">{summary}</span> : null}
        </span>
        <span className="engineering-accordion__icon" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      <div id={panelId} hidden={!open} className="engineering-accordion__panel">
        {children}
      </div>
    </article>
  );
}
