import type { ProjectMetric as ProjectMetricType } from "@/data/types";
import { cn } from "@/lib/utils";

type ProjectMetricProps = {
  metric: ProjectMetricType;
  compact?: boolean;
};

export function ProjectMetric({ metric, compact }: ProjectMetricProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-border bg-surface p-3",
        compact && "p-2.5",
      )}
    >
      <p className="text-lg font-semibold tracking-tight text-foreground">
        {metric.value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-muted-strong">{metric.label}</p>
      {metric.description ? (
        <p className="mt-1 text-xs text-muted">{metric.description}</p>
      ) : null}
    </div>
  );
}
