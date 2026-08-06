import Link from "next/link";
import type { Project } from "@/data/types";

type RelatedProjectsProps = {
  projects: Project[];
};

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  const items = projects.slice(0, 2);
  if (!items.length) return null;

  return (
    <aside className="case-study__related" aria-labelledby="related-heading">
      <h2 id="related-heading" className="case-study__related-title">
        Related projects
      </h2>
      <div className="case-study__related-grid">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/projects/${item.slug}`}
            className="case-study__related-card"
          >
            <p className="case-study__related-name">{item.name}</p>
            <p className="case-study__related-desc">{item.shortDescription}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
