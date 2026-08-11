import Link from "next/link";
import type { Project } from "@/data/types";

type OverviewRelatedProjectsProps = {
  projects: Project[];
};

export function OverviewRelatedProjects({
  projects,
}: OverviewRelatedProjectsProps) {
  const items = projects.slice(0, 2);
  if (!items.length) return null;

  return (
    <aside className="overview-case__related" aria-labelledby="related-heading">
      <h2 id="related-heading" className="overview-case__related-title">
        Related projects
      </h2>
      <div className="overview-case__related-grid">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/overview/projects/${item.slug}`}
            className="overview-case__related-card"
          >
            <p className="overview-case__related-name">{item.name}</p>
            <p className="overview-case__related-desc">
              {item.shortDescription}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
