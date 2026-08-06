import type { ReactNode } from "react";

type CaseStudySectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
};

export function CaseStudySection({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
}: CaseStudySectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={["case-study__section", className].filter(Boolean).join(" ")}
    >
      {eyebrow ? <p className="case-study__section-eyebrow">{eyebrow}</p> : null}
      <h2 id={headingId} className="case-study__section-title">
        {title}
      </h2>
      {intro ? <p className="case-study__section-intro">{intro}</p> : null}
      {children}
    </section>
  );
}
