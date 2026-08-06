type CalloutVariant = "note" | "decision" | "tradeoff" | "result";

type CaseStudyCalloutProps = {
  variant?: CalloutVariant;
  title: string;
  children: string;
};

const VARIANT_LABEL: Record<CalloutVariant, string> = {
  note: "Note",
  decision: "Decision",
  tradeoff: "Trade-off",
  result: "Result",
};

export function CaseStudyCallout({
  variant = "note",
  title,
  children,
}: CaseStudyCalloutProps) {
  return (
    <aside className={`case-study__callout case-study__callout--${variant}`}>
      <p className="case-study__callout-label">{VARIANT_LABEL[variant]}</p>
      <h3 className="case-study__callout-title">{title}</h3>
      <p className="case-study__callout-body">{children}</p>
    </aside>
  );
}
