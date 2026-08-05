import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/types";
import {
  getProjectTheme,
  resolveProjectCover,
  type ProjectVisualTheme,
} from "@/lib/project-themes";
import { cn } from "@/lib/utils";
import { ExpandableDetails } from "./ExpandableDetails";
import { FeaturedProjectTitle } from "./FeaturedProjectTitle";
import { FeaturedProjectVideo } from "./FeaturedProjectVideo";

type FeaturedProjectSectionProps = {
  project: Project;
  /** Override theme media position when needed. */
  mediaPosition?: "left" | "right";
  priority?: boolean;
};

function ProjectLogoMark({
  project,
  theme,
}: {
  project: Project;
  theme: ProjectVisualTheme;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {theme.media.logoSrc ? (
        <Image
          src={theme.media.logoSrc}
          alt={theme.media.logoAlt ?? `${project.name} logo`}
          width={theme.id === "joblinx" ? 56 : 36}
          height={theme.id === "joblinx" ? 56 : 36}
          className={cn(
            "rounded-[6px] object-contain",
            theme.id === "joblinx" ? "h-16 w-16" : "h-12 w-12",
          )}
        />
      ) : null}
      {theme.media.wordmark ? (
        <span className={theme.typography.wordmarkClassName}>
          {theme.media.wordmark}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Full-width branded homepage feature.
 * Logo + title sit above the card on the portfolio shell; card content
 * keeps brand surfaces. DOM order stays content → media → actions on mobile.
 */
export function FeaturedProjectSection({
  project,
  mediaPosition,
  priority = false,
}: FeaturedProjectSectionProps) {
  const theme = getProjectTheme(project.slug);
  const cover = resolveProjectCover(project);
  const caseStudy = `/projects/${project.slug}`;
  const live = project.links.find((link) => link.type === "live");
  const github = project.links.find((link) => link.type === "github");
  const mediaSide = mediaPosition ?? theme?.media.mediaPosition ?? "right";
  const mediaLeft = mediaSide === "left";

  if (!theme || !cover) {
    return null;
  }

  // Above the card on charcoal: Almaari ink is too dark — use brand accent.
  const titleAboveCard =
    theme.id === "almaari" ? theme.colors.primary : theme.colors.name;

  return (
    <article
      className={cn(
        "project-theme space-y-4",
        `project-theme--${theme.id}`,
        theme.typography.bodyClassName,
      )}
      aria-labelledby={`${project.slug}-featured-heading`}
    >
      <div
        className="flex flex-wrap items-center gap-3 px-0.5"
        data-reveal-trigger=""
      >
        <ProjectLogoMark project={project} theme={theme} />
        <FeaturedProjectTitle
          id={`${project.slug}-featured-heading`}
          name={project.name}
          href={caseStudy}
          color={titleAboveCard}
          headingClassName={theme.typography.headingClassName}
        />
      </div>

      <div className="project-theme__card">
        <div
          className={cn(
            "grid gap-6 p-5 sm:p-6 md:gap-8 md:p-8",
            "lg:grid-cols-2 lg:items-start",
            mediaLeft
              ? "lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]"
              : "lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]",
          )}
        >
          <header
            className={cn(
              "space-y-4",
              mediaLeft
                ? "lg:col-start-2 lg:row-start-1"
                : "lg:col-start-1 lg:row-start-1",
            )}
          >
            {project.status ? (
              <span
                className="inline-flex rounded-[6px] border px-2.5 py-1 text-sm font-medium"
                style={{
                  borderColor: "var(--project-border)",
                  color: "var(--project-text-secondary)",
                  background: "var(--project-surface)",
                }}
              >
                {project.status}
              </span>
            ) : null}
            <p
              className="max-w-prose text-lg leading-relaxed md:text-xl md:leading-relaxed"
              style={{ color: "var(--project-text-secondary)" }}
            >
              {project.shortDescription}
            </p>
            <p
              className="text-base font-medium md:text-lg"
              style={{ color: "var(--project-text)" }}
            >
              {project.role}
            </p>
            {project.metrics.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-3">
                {project.metrics.slice(0, 3).map((metric) => (
                  <div key={metric.label} className="project-theme__metric p-3 md:p-3.5">
                    <p
                      className={cn(
                        "text-xl font-semibold tracking-tight md:text-2xl",
                        theme.id === "supportpilot" && "tabular-nums",
                        theme.id === "joblinx" &&
                          theme.typography.headingClassName,
                      )}
                      style={{ color: "var(--project-text)" }}
                    >
                      {metric.value}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-sm font-medium",
                        theme.id === "supportpilot" &&
                          "uppercase tracking-[0.12em]",
                      )}
                      style={{ color: "var(--project-text-secondary)" }}
                    >
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </header>

          <div
            className={cn(
              "min-w-0",
              mediaLeft
                ? "lg:col-start-1 lg:row-start-1 lg:row-span-2"
                : "lg:col-start-2 lg:row-start-1 lg:row-span-2",
            )}
          >
            <div
              className={cn(
                "project-theme__media",
                "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out",
                "motion-safe:hover:-translate-y-0.5",
              )}
            >
              {theme.media.featuredVideo ? (
                <FeaturedProjectVideo
                  webm={theme.media.featuredVideo.webm}
                  mp4={theme.media.featuredVideo.mp4}
                  poster={theme.media.featuredVideo.poster}
                  label={`${project.name} product demo`}
                />
              ) : (
                <Image
                  src={cover}
                  alt={`${project.name} product screenshot`}
                  width={1400}
                  height={900}
                  className="aspect-[16/10] w-full object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority={priority}
                />
              )}
            </div>
          </div>

          <div
            className={cn(
              "space-y-5",
              mediaLeft
                ? "lg:col-start-2 lg:row-start-2"
                : "lg:col-start-1 lg:row-start-2",
            )}
          >
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  className="project-theme__tag px-3 py-1.5 text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            {project.expandable ? (
              <ExpandableDetails preview={project.expandable} />
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Link
                href={caseStudy}
                className="project-theme__cta min-h-11 px-5 py-2.5 text-base"
              >
                View Case Study
              </Link>
              {live ? (
                <a
                  href={live.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-theme__cta-secondary min-h-11 px-5 py-2.5 text-base"
                >
                  Visit Live Product
                </a>
              ) : null}
              {github ? (
                <a
                  href={github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-theme__cta-ghost min-h-11 px-4 py-2.5 text-base"
                >
                  View Source
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
