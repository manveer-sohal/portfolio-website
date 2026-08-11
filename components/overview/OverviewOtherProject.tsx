import Link from "next/link";
import type { Project } from "@/data/types";

type OverviewOtherProjectProps = {
  project: Project;
};

const LINK_ORDER = ["live", "github", "devpost", "website"] as const;

export function OverviewOtherProject({ project }: OverviewOtherProjectProps) {
  const tech = project.technologies.slice(0, 4);
  const links = LINK_ORDER.map((type) =>
    project.links.find((link) => link.type === type),
  ).filter((link): link is NonNullable<typeof link> => Boolean(link));

  return (
    <div className="overview-other__row">
      <div>
        <p className="overview-other__name">{project.name}</p>
        {project.status ? (
          <p className="overview-other__meta">{project.status}</p>
        ) : null}
      </div>
      <div>
        <p className="overview-other__desc">{project.shortDescription}</p>
        {tech.length > 0 ? (
          <p className="overview-other__meta">{tech.join(" · ")}</p>
        ) : null}
      </div>
      <div className="overview-other__links">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="overview-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.type === "live"
              ? "Live"
              : link.type === "github"
                ? "GitHub"
                : link.type === "devpost"
                  ? "Devpost"
                  : link.label}
          </a>
        ))}
        <Link
          href={`/overview/projects/${project.slug}`}
          className="overview-link"
        >
          Case study
        </Link>
      </div>
    </div>
  );
}
