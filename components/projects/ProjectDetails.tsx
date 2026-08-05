import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/data/types";
import { getProjectBySlug } from "@/data/projects";
import {
  getProjectTheme,
  resolveProjectCover,
} from "@/lib/project-themes";
import { cn } from "@/lib/utils";
import { ProjectArchitecture } from "./ProjectArchitecture";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectMetric } from "./ProjectMetric";

type ProjectDetailsProps = {
  project: Project;
};

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const live = project.links.find((link) => link.type === "live");
  const github = project.links.find((link) => link.type === "github");
  const website = project.links.find((link) => link.type === "website");
  const devpost = project.links.find((link) => link.type === "devpost");
  const related = (project.relatedSlugs ?? [])
    .map((slug) => getProjectBySlug(slug))
    .filter((item): item is Project => Boolean(item));
  const theme = getProjectTheme(project.slug);
  const cover = resolveProjectCover(project);
  const hasCover = Boolean(cover);

  return (
    <article>
      {theme ? (
        <header
          className={cn(
            "project-theme project-case-hero p-6 md:p-8",
            `project-theme--${theme.id}`,
            theme.typography.bodyClassName,
          )}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--project-primary)" }}
          >
            Case study
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {theme.media.logoSrc ? (
              <Image
                src={theme.media.logoSrc}
                alt={theme.media.logoAlt ?? `${project.name} logo`}
                width={40}
                height={40}
                className="h-10 w-10 rounded-[8px] object-contain"
              />
            ) : null}
            {theme.media.wordmark ? (
              <span className={theme.typography.wordmarkClassName}>
                {theme.media.wordmark}
              </span>
            ) : null}
          </div>
          <h1
            className={cn(
              "project-theme__name mt-3 text-3xl font-semibold tracking-tight md:text-4xl",
              theme.typography.headingClassName,
            )}
            style={{ color: "var(--project-name)" }}
          >
            {project.name}
          </h1>
          <p
            className="mt-4 max-w-3xl text-xl"
            style={{ color: "var(--project-text-secondary)" }}
          >
            {project.fullDescription}
          </p>
          <div
            className="mt-5 flex flex-wrap items-center gap-3 text-base"
            style={{ color: "var(--project-text-secondary)" }}
          >
            <span>{project.role}</span>
            {project.status ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{project.status}</span>
              </>
            ) : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {live ? (
              <a
                href={live.href}
                target="_blank"
                rel="noopener noreferrer"
                className="project-theme__cta px-5 py-2.5 text-base"
              >
                Visit Live Product
              </a>
            ) : null}
            {website ? (
              <a
                href={website.href}
                target="_blank"
                rel="noopener noreferrer"
                className="project-theme__cta-secondary px-5 py-2.5 text-base"
              >
                Website
              </a>
            ) : null}
            {github ? (
              <a
                href={github.href}
                target="_blank"
                rel="noopener noreferrer"
                className="project-theme__cta-secondary px-5 py-2.5 text-base"
              >
                View Source
              </a>
            ) : null}
            {devpost ? (
              <a
                href={devpost.href}
                target="_blank"
                rel="noopener noreferrer"
                className="project-theme__cta-ghost px-5 py-2.5 text-base"
              >
                Devpost
              </a>
            ) : null}
          </div>
        </header>
      ) : (
        <header className="border-b border-border-subtle pb-10">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-muted">
            Case study
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-3xl text-xl leading-relaxed text-muted-strong">
            {project.fullDescription}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-base text-muted">
            <span>{project.role}</span>
            {project.status ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{project.status}</span>
              </>
            ) : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {live ? (
              <Button href={live.href} external>
                Visit Live Product
              </Button>
            ) : null}
            {website ? (
              <Button href={website.href} variant="secondary" external>
                Website
              </Button>
            ) : null}
            {github ? (
              <Button href={github.href} variant="secondary" external>
                View Source
              </Button>
            ) : null}
            {devpost ? (
              <Button href={devpost.href} variant="ghost" external>
                Devpost
              </Button>
            ) : null}
          </div>
        </header>
      )}

      {hasCover ? (
        <div
          className={cn(
            "mt-8 overflow-hidden",
            theme
              ? cn(
                  "project-theme p-3",
                  `project-theme--${theme.id}`,
                )
              : "rounded-[14px] border border-border bg-surface-elevated p-1.5 overflow-hidden",
          )}
        >
          <div className={theme ? "project-theme__media" : undefined}>
            <Image
              src={cover}
              alt={`${project.name} primary screenshot`}
              width={1600}
              height={1000}
              priority
              className="w-full object-cover object-top"
              sizes="(max-width: 1120px) 100vw, 1120px"
            />
          </div>
        </div>
      ) : null}

      {project.metrics.length > 0 ? (
        <section className="mt-10" aria-labelledby="metrics-heading">
          <h2 id="metrics-heading" className="text-3xl font-semibold tracking-tight">
            Results and metrics
          </h2>
          <div
            className={cn(
              "mt-5 grid gap-3 sm:grid-cols-3",
              theme && `project-theme project-theme--${theme.id}`,
            )}
          >
            {project.metrics.map((metric) =>
              theme ? (
                <div key={metric.label} className="project-theme__metric p-4">
                  <p
                    className={cn(
                      "text-3xl font-semibold tracking-tight",
                      theme.id === "supportpilot" && "tabular-nums",
                    )}
                    style={{ color: "var(--project-text)" }}
                  >
                    {metric.value}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm font-medium",
                      theme.id === "supportpilot" &&
                        "uppercase tracking-[0.12em]",
                    )}
                    style={{ color: "var(--project-text-secondary)" }}
                  >
                    {metric.label}
                  </p>
                  {metric.description ? (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--project-text-secondary)" }}
                    >
                      {metric.description}
                    </p>
                  ) : null}
                </div>
              ) : (
                <ProjectMetric key={metric.label} metric={metric} />
              ),
            )}
          </div>
        </section>
      ) : null}

      {project.problem?.length ? (
        <section className="mt-12" aria-labelledby="problem-heading">
          <h2 id="problem-heading" className="text-3xl font-semibold tracking-tight">
            The problem
          </h2>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-lg leading-relaxed text-muted-strong">
            {project.problem.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.solution?.length ? (
        <section className="mt-12" aria-labelledby="solution-heading">
          <h2 id="solution-heading" className="text-3xl font-semibold tracking-tight">
            The solution
          </h2>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-lg leading-relaxed text-muted-strong">
            {project.solution.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.contributions?.length ? (
        <section className="mt-12" aria-labelledby="role-heading">
          <h2 id="role-heading" className="text-3xl font-semibold tracking-tight">
            What I personally built
          </h2>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-lg leading-relaxed text-muted-strong">
            {project.contributions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.features?.length ? (
        <section className="mt-12" aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-3xl font-semibold tracking-tight">
            Core features
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="rounded-[12px] border border-border bg-surface px-4 py-3 text-base leading-relaxed text-muted-strong"
              >
                {feature}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.architecture?.length ? (
        <ProjectArchitecture items={project.architecture} />
      ) : null}

      {project.technicalDecisions?.length ? (
        <section className="mt-12" aria-labelledby="decisions-heading">
          <h2 id="decisions-heading" className="text-3xl font-semibold tracking-tight">
            Important technical decisions
          </h2>
          <div className="mt-5 space-y-4">
            {project.technicalDecisions.map((decision) => (
              <div
                key={decision.title}
                className="rounded-[12px] border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-foreground">{decision.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-strong">{decision.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {project.tradeoffs?.length ? (
        <section className="mt-12" aria-labelledby="tradeoffs-heading">
          <h2 id="tradeoffs-heading" className="text-3xl font-semibold tracking-tight">
            Challenges and trade-offs
          </h2>
          <div className="mt-5 space-y-4">
            {project.tradeoffs.map((tradeoff) => (
              <div
                key={tradeoff.title}
                className="rounded-[12px] border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-foreground">{tradeoff.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-strong">{tradeoff.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12" aria-labelledby="stack-heading">
        <h2 id="stack-heading" className="text-3xl font-semibold tracking-tight">
          Technology stack
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      </section>

      {project.gallery?.length ? <ProjectGallery items={project.gallery} /> : null}

      {related.length > 0 ? (
        <section className="mt-12 border-t border-border-subtle pt-10" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-3xl font-semibold tracking-tight">
            Related projects
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/projects/${item.slug}`}
                className="rounded-[12px] border border-border bg-surface p-5 transition-colors hover:border-border-strong"
              >
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="mt-2 text-base leading-relaxed text-muted-strong">{item.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
