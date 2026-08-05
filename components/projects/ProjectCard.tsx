import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/data/types";
import { getProjectTheme, resolveProjectCover } from "@/lib/project-themes";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const live = project.links.find((link) => link.type === "live");
  const github = project.links.find((link) => link.type === "github");
  const external =
    live ??
    project.links.find((link) => link.type === "devpost") ??
    project.links.find((link) => link.type === "website") ??
    github;
  const theme = getProjectTheme(project.slug);
  const cover = resolveProjectCover(project);

  if (theme) {
    return (
      <article
        className={cn(
          "project-theme project-theme__card flex h-full flex-col overflow-hidden transition-[border-color,box-shadow] duration-150",
          `project-theme--${theme.id}`,
          theme.typography.bodyClassName,
        )}
      >
        <Link href={`/projects/${project.slug}`} className="block p-3 pb-0">
          <div className="project-theme__media">
            <Image
              src={cover}
              alt={`${project.name} screenshot`}
              width={800}
              height={500}
              className="aspect-[16/10] w-full object-cover object-top"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </Link>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {theme.media.logoSrc ? (
              <Image
                src={theme.media.logoSrc}
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 rounded-[4px] object-contain"
              />
            ) : null}
            {theme.media.wordmark ? (
              <span className={theme.typography.wordmarkClassName}>
                {theme.media.wordmark}
              </span>
            ) : null}
            {project.status ? (
              <span
                className="text-xs"
                style={{ color: "var(--project-text-secondary)" }}
              >
                {project.status}
              </span>
            ) : null}
          </div>
          <h3
            className={cn(
              "project-theme__name text-xl font-semibold tracking-tight",
              theme.typography.headingClassName,
            )}
            style={{ color: "var(--project-name)" }}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="hover:opacity-90"
            >
              {project.name}
            </Link>
          </h3>
          <p
            className="mt-2 text-base leading-relaxed"
            style={{ color: "var(--project-text-secondary)" }}
          >
            {project.shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="project-theme__tag px-2.5 py-1 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="mt-auto flex flex-wrap gap-4 pt-5 text-base">
            <Link
              href={`/projects/${project.slug}`}
              className="other-project-card__cta font-medium"
              style={{ color: "var(--project-primary)" }}
            >
              View Case Study
              <span className="other-project-card__cta-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            {external ? (
              <a
                href={external.href}
                target="_blank"
                rel="noopener noreferrer"
                className="other-project-card__cta font-medium"
                style={{ color: "var(--project-primary)" }}
              >
                {external.label}
                <span className="other-project-card__cta-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ) : null}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="other-project-card group flex h-full flex-col overflow-hidden rounded-[12px] border border-border bg-surface">
      {project.coverImage ? (
        <Link
          href={`/projects/${project.slug}`}
          className="other-project-card__media block border-b border-border-subtle"
        >
          <Image
            src={project.coverImage}
            alt={`${project.name} screenshot`}
            width={800}
            height={500}
            className="other-project-card__image aspect-[16/10] w-full object-cover object-top"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {project.status ? (
            <span className="text-xs text-muted">{project.status}</span>
          ) : null}
        </div>
        <h3 className="text-xl font-semibold tracking-tight">
          <Link
            href={`/projects/${project.slug}`}
            className="other-project-card__title transition-colors hover:text-foreground"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 text-base leading-relaxed text-muted-strong">
          {project.shortDescription}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap gap-4 pt-5 text-base">
          <Link
            href={`/projects/${project.slug}`}
            className="other-project-card__cta font-medium text-accent"
          >
            View Case Study
            <span className="other-project-card__cta-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          {external ? (
            <a
              href={external.href}
              target="_blank"
              rel="noopener noreferrer"
              className="other-project-card__cta font-medium text-accent"
            >
              {external.label}
              <span className="other-project-card__cta-arrow" aria-hidden="true">
                →
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
