import type { EvidenceStatus } from "@/data/almaari-case-studies";
import { cn } from "@/lib/utils";

const labels: Record<EvidenceStatus, string> = {
  current: "Current",
  "in-progress": "In progress",
  proposed: "Proposed",
  "design-target": "Design target",
  measured: "Measured",
};

export function CaseStudyStatusBadge({
  status,
  className,
}: {
  status: EvidenceStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "engineering-status",
        `engineering-status--${status}`,
        className,
      )}
    >
      <span className="engineering-status__dot" aria-hidden="true" />
      {labels[status]}
    </span>
  );
}
