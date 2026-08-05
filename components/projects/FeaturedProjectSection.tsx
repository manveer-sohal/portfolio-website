import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/types";
import { getProjectTheme, resolveProjectCover } from "@/lib/project-themes";
import { cn } from "@/lib/utils";
import { FeaturedProjectCardGlow } from "./FeaturedProjectCardGlow";
import { FeaturedProjectVideo } from "./FeaturedProjectVideo";

type FeaturedProjectSectionProps = {
  project: Project;
  priority?: boolean;
  /** Desktop media column side; alternates per project. */
  mediaSide?: "left" | "right";
};

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.38-.01 2.48-.01 2.82 0 .26.18.59.69.48A10.33 10.33 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

/**
 * Editorial featured project: large media on top, concise meta below.
 */
export function FeaturedProjectSection({
  project,
  priority = false,
  mediaSide = "left",
}: FeaturedProjectSectionProps) {
  const theme = getProjectTheme(project.slug);
  const cover = resolveProjectCover(project);
  const caseStudy = `/projects/${project.slug}`;
  const live = project.links.find((link) => link.type === "live");
  const github = project.links.find((link) => link.type === "github");
  const video = theme?.media.featuredVideo;
  const description = project.featuredSupport ?? project.shortDescription;
  const stack = project.technologies.slice(0, 6);
  const metaLabel = project.status;
  const glowColor =
    theme?.id === "almaari" ? theme.colors.primary : theme?.colors.name;

  if (!theme || (!cover && !video) || !glowColor) {
    return null;
  }

  return (
    <article
      className={cn(
        "project-theme featured-editorial",
        `project-theme--${theme.id}`,
        mediaSide === "left"
          ? "featured-editorial--media-left"
          : "featured-editorial--media-right",
        theme.typography.bodyClassName,
      )}
      data-featured-glow={project.slug}
      aria-labelledby={`${project.slug}-featured-heading`}
    >
      <div className="featured-editorial__media-shell">
        <FeaturedProjectCardGlow color={glowColor} />
        <div className="featured-editorial__media" data-reveal-trigger="">
          {video ? (
            <FeaturedProjectVideo
              webm={video.webm}
              mp4={video.mp4}
              poster={video.poster}
              label={video.ariaLabel ?? `Animated preview of ${project.name}`}
              framed={theme.id === "almaari"}
              priority={priority}
            />
          ) : (
            <div className="relative h-full min-h-0 w-full">
              <Image
                src={cover}
                alt={`${project.name} product screenshot`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 900px) 100vw, 60vw"
                priority={priority}
              />
            </div>
          )}
        </div>
      </div>

      <div className="featured-editorial__body">
        <div className="featured-editorial__header">
          <h3
            id={`${project.slug}-featured-heading`}
            className={cn(
              "featured-editorial__title",
              theme.typography.headingClassName,
            )}
          >
            <Link href={caseStudy} className="featured-editorial__name">
              {project.name}
            </Link>
            {metaLabel ? (
              <span className="featured-editorial__meta"> — {metaLabel}</span>
            ) : null}
          </h3>

          <div className="featured-editorial__links">
            {live ? (
              <a
                href={live.href}
                target="_blank"
                rel="noopener noreferrer"
                className="featured-editorial__icon-link"
                aria-label={`${project.name} live product`}
              >
                <ExternalIcon className="h-5 w-5" />
              </a>
            ) : null}
            {github ? (
              <a
                href={github.href}
                target="_blank"
                rel="noopener noreferrer"
                className="featured-editorial__icon-link"
                aria-label={`${project.name} source on GitHub`}
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            ) : null}
          </div>
        </div>

        <p className="featured-editorial__stack">{stack.join("  ·  ")}</p>

        <p className="featured-editorial__description">{description}</p>

        <Link href={caseStudy} className="featured-editorial__cta">
          View Case Study
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </article>
  );
}
