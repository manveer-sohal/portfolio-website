import Link from "next/link";
import type { Project } from "@/data/types";
import { OverviewProjectMedia } from "./OverviewProjectMedia";
import { OverviewReveal } from "./OverviewReveal";

type OverviewProjectItemProps = {
  project: Project;
  year?: string;
};

function linkByType(project: Project, type: Project["links"][number]["type"]) {
  return project.links.find((link) => link.type === type);
}

export function OverviewProjectItem({
  project,
  year,
}: OverviewProjectItemProps) {
  const projectHref = `/overview/projects/${project.slug}`;
  const caseHref =
    project.slug === "almaari"
      ? "/overview/projects/almaari/case-studies"
      : projectHref;
  const live = linkByType(project, "live");
  const github = linkByType(project, "github");
  const tech = project.technologies.slice(0, 5);
  const highlights = project.metrics.slice(0, 2);

  const meta = [project.status, year].filter(Boolean).join(" · ");

  return (
    <OverviewReveal className="overview-item--project">
      <p className="overview-item__meta">{meta || project.role}</p>
      <div className="overview-item__title-row">
        <Link href={projectHref} className="overview-item__title">
          {project.name}
        </Link>
        <span className="overview-item__arrow" aria-hidden="true">
          →
        </span>
      </div>
      <p className="overview-item__role">{project.role}</p>
      <Link
        href={caseHref}
        className="overview-project-media__link"
        aria-label={`Read the ${project.name} case study`}
      >
        <OverviewProjectMedia project={project} />
      </Link>
      <p className="overview-item__body">{project.shortDescription}</p>
      {tech.length > 0 ? (
        <p className="overview-item__tech">{tech.join(" · ")}</p>
      ) : null}
      {highlights.length > 0 ? (
        <ul className="overview-item__highlights">
          {highlights.map((metric) => (
            <li key={metric.label}>
              <strong>{metric.value}</strong> — {metric.label}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="overview-item__links">
        <Link href={caseHref} className="overview-link">
          Read case study →
        </Link>
        {live ? (
          <a
            href={live.href}
            className="overview-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit live product
          </a>
        ) : null}
        {github ? (
          <a
            href={github.href}
            className="overview-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View source
          </a>
        ) : null}
      </div>
    </OverviewReveal>
  );
}
