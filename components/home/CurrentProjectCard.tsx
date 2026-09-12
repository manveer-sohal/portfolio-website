import Link from "next/link";
import type { CSSProperties } from "react";
import type { CurrentProject } from "@/data/current-projects";
import { CurrentProjectCarousel } from "./CurrentProjectCarousel";

type CurrentProjectCardProps = {
  project: CurrentProject;
};

export function CurrentProjectCard({ project }: CurrentProjectCardProps) {
  const style = {
    "--current-project-accent": project.accent,
  } as CSSProperties;

  return (
    <article className="current-project-card" style={style}>
      <div
        className={
          project.media?.length
            ? "current-project-card__media"
            : "current-project-card__media current-project-card__media--empty"
        }
        aria-label={
          project.media?.length
            ? undefined
            : `${project.name} product preview coming soon`
        }
      >
        {project.media?.length ? (
          <CurrentProjectCarousel
            media={project.media}
            projectName={project.name}
          />
        ) : null}
      </div>
      <span className="current-project-card__rail" aria-hidden="true" />
      <div className="current-project-card__content">
        <h3>
          {project.name}
          <span> — {project.status}</span>
        </h3>
        <p className="current-project-card__stack">
          {project.technologies.join(" · ")}
        </p>
        <p className="current-project-card__summary">{project.summary}</p>
        <p className="current-project-card__focus">
          <strong>Currently building:</strong> {project.highlights.join(" · ")}
        </p>
        {project.href && project.ctaLabel ? (
          <Link href={project.href} className="current-project-card__cta">
            {project.ctaLabel}
            <span aria-hidden="true"> →</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
