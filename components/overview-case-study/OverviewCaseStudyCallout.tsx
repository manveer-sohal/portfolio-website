type OverviewCaseStudyCalloutProps = {
  variant?: "decision" | "tradeoff" | "note" | "result";
  title: string;
  children: string;
};

const LABELS = {
  decision: "Decision",
  tradeoff: "Trade-off",
  note: "Note",
  result: "Result",
} as const;

export function OverviewCaseStudyCallout({
  variant = "note",
  title,
  children,
}: OverviewCaseStudyCalloutProps) {
  return (
    <aside className="overview-case__callout">
      <p className="overview-case__callout-label">{LABELS[variant]}</p>
      <h3 className="overview-case__callout-title">{title}</h3>
      <p className="overview-case__callout-body">{children}</p>
    </aside>
  );
}
