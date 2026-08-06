type GlanceItem = {
  label: string;
  value: string;
};

type CaseStudyAtAGlanceProps = {
  items: GlanceItem[];
};

export function CaseStudyAtAGlance({ items }: CaseStudyAtAGlanceProps) {
  if (!items.length) return null;

  return (
    <div className="case-study__glance">
      {items.map((item) => (
        <div key={item.label} className="case-study__glance-item">
          <p className="case-study__glance-label">{item.label}</p>
          <p className="case-study__glance-value">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function buildAtAGlanceItems(input: {
  shortDescription: string;
  problemSummary?: string;
  role: string;
  contributions?: string[];
  firstMetric?: { value: string; label: string };
}): GlanceItem[] {
  const items: GlanceItem[] = [];

  const product = input.shortDescription.trim();
  if (product) {
    items.push({
      label: "Product",
      value:
        product.length > 140 ? `${product.slice(0, 137).trimEnd()}…` : product,
    });
  }

  if (input.problemSummary?.trim()) {
    const audience = input.problemSummary.trim();
    items.push({
      label: "Audience / need",
      value:
        audience.length > 140
          ? `${audience.slice(0, 137).trimEnd()}…`
          : audience,
    });
  }

  const ownership =
    input.contributions?.[0]?.trim() || input.role.trim() || "";
  if (ownership) {
    items.push({
      label: "Ownership",
      value:
        ownership.length > 140
          ? `${ownership.slice(0, 137).trimEnd()}…`
          : ownership,
    });
  }

  if (input.firstMetric) {
    items.push({
      label: "Result",
      value: `${input.firstMetric.value} — ${input.firstMetric.label}`,
    });
  }

  return items.slice(0, 4);
}
