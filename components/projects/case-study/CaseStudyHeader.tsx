import Image from "next/image";
import type { Project, ProjectLink } from "@/data/types";
import type { ProjectVisualTheme } from "@/lib/project-themes";
import { cn } from "@/lib/utils";

type CaseStudyHeaderProps = {
  project: Project;
  theme: ProjectVisualTheme | null;
  links: {
    live?: ProjectLink;
    github?: ProjectLink;
    website?: ProjectLink;
    devpost?: ProjectLink;
  };
};

export function CaseStudyHeader({
  project,
  theme,
  links,
}: CaseStudyHeaderProps) {
  return (
    <header className="case-study__header">
      <p className="case-study__eyebrow">Case study</p>

      {theme?.media.logoSrc || theme?.media.wordmark ? (
        <div className="case-study__brand-row">
          {theme.media.logoSrc ? (
            <Image
              src={theme.media.logoSrc}
              alt={theme.media.logoAlt ?? `${project.name} logo`}
              width={36}
              height={36}
              className="case-study__brand-logo"
            />
          ) : null}
          {theme.media.wordmark ? (
            <span
              className={cn(
                "text-lg font-semibold tracking-tight text-[var(--case-heading)]",
                theme.typography.wordmarkClassName,
              )}
            >
              {theme.media.wordmark}
            </span>
          ) : null}
        </div>
      ) : null}

      <h1 className="case-study__title">{project.name}</h1>
      <p className="case-study__lede">{project.shortDescription}</p>

      <div className="case-study__meta-inline">
        <span>{project.role}</span>
        {project.status ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{project.status}</span>
          </>
        ) : null}
      </div>

      {(links.live || links.website || links.github || links.devpost) && (
        <div className="case-study__actions">
          {links.live ? (
            <a
              href={links.live.href}
              target="_blank"
              rel="noopener noreferrer"
              className="case-study__btn case-study__btn--primary"
            >
              Visit Live Product
            </a>
          ) : null}
          {links.website ? (
            <a
              href={links.website.href}
              target="_blank"
              rel="noopener noreferrer"
              className="case-study__btn case-study__btn--secondary"
            >
              Website
            </a>
          ) : null}
          {links.github ? (
            <a
              href={links.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="case-study__btn case-study__btn--secondary"
            >
              View Source
            </a>
          ) : null}
          {links.devpost ? (
            <a
              href={links.devpost.href}
              target="_blank"
              rel="noopener noreferrer"
              className="case-study__btn case-study__btn--secondary"
            >
              Devpost
            </a>
          ) : null}
        </div>
      )}
    </header>
  );
}
