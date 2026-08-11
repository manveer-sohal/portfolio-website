import type { Project } from "@/data/types";

type OverviewCaseStudyHeaderProps = {
  project: Project;
};

export function OverviewCaseStudyHeader({
  project,
}: OverviewCaseStudyHeaderProps) {
  const live = project.links.find((l) => l.type === "live");
  const github = project.links.find((l) => l.type === "github");
  const website = project.links.find((l) => l.type === "website");
  const devpost = project.links.find((l) => l.type === "devpost");

  return (
    <header>
      <p className="overview-case__eyebrow">
        {[project.status ? "Project" : null, project.status]
          .filter(Boolean)
          .join(" · ") || "Project"}
      </p>
      <h1 className="overview-case__title">{project.name}</h1>
      <p className="overview-case__lede">{project.shortDescription}</p>
      <div className="overview-case__meta">
        <span>{project.role}</span>
        {project.status ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{project.status}</span>
          </>
        ) : null}
      </div>
      <div className="overview-case__actions">
        {live ? (
          <a
            className="overview-link"
            href={live.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit live product
          </a>
        ) : null}
        {website ? (
          <a
            className="overview-link"
            href={website.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Website
          </a>
        ) : null}
        {github ? (
          <a
            className="overview-link"
            href={github.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        ) : null}
        {devpost ? (
          <a
            className="overview-link"
            href={devpost.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Devpost
          </a>
        ) : null}
      </div>
    </header>
  );
}
