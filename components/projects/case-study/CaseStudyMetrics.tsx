import type { ProjectMetric } from "@/data/types";

type CaseStudyMetricsProps = {
  metrics: ProjectMetric[];
};

export function CaseStudyMetrics({ metrics }: CaseStudyMetricsProps) {
  if (!metrics.length) return null;

  return (
    <div className="case-study__metrics">
      {metrics.map((metric) => (
        <div key={metric.label} className="case-study__metric">
          <p className="case-study__metric-value">{metric.value}</p>
          <p className="case-study__metric-label">{metric.label}</p>
          {metric.description ? (
            <p className="case-study__metric-desc">{metric.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
