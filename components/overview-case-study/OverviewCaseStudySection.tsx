import type { ReactNode } from "react";

type OverviewCaseStudySectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

export function OverviewCaseStudySection({
  id,
  eyebrow,
  title,
  children,
}: OverviewCaseStudySectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="overview-case__section"
    >
      {eyebrow ? (
        <p className="overview-case__section-eyebrow">{eyebrow}</p>
      ) : null}
      <h2 id={headingId} className="overview-case__section-title">
        {title}
      </h2>
      {children}
    </section>
  );
}
