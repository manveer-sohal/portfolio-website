import Link from "next/link";
import type { Project } from "@/data/types";
import { getProjectBySlug } from "@/data/projects";
import { resolveProjectCover } from "@/lib/project-themes";
import { OverviewCaseStudyHeader } from "./OverviewCaseStudyHeader";
import { OverviewCaseStudyMedia } from "./OverviewCaseStudyMedia";
import { OverviewRelatedProjects } from "./OverviewRelatedProjects";
import { OverviewTableOfContents } from "./OverviewTableOfContents";
import { buildOverviewCaseStudySections } from "./buildOverviewCaseStudySections";

type OverviewCaseStudyLayoutProps = {
  project: Project;
  coverOverride?: string;
};

export function OverviewCaseStudyLayout({
  project,
  coverOverride,
}: OverviewCaseStudyLayoutProps) {
  const cover = coverOverride ?? resolveProjectCover(project);
  const backLink =
    project.slug === "almaari"
      ? {
          href: "/overview/projects/almaari/case-studies",
          label: "← Almaari case studies",
        }
      : { href: "/overview", label: "← Back to Overview" };
  const sections = buildOverviewCaseStudySections(project);
  const tocItems = sections.map(({ id, label }) => ({ id, label }));
  const related = (project.relatedSlugs ?? [])
    .map((slug) => getProjectBySlug(slug))
    .filter((item): item is Project => Boolean(item));

  return (
    <article className="overview-case">
      <div className="overview-case__shell">
        <Link href={backLink.href} className="overview-case__back">
          {backLink.label}
        </Link>

        <OverviewCaseStudyHeader project={project} />

        {cover ? (
          <div className="overview-case__cover">
            <OverviewCaseStudyMedia
              src={cover}
              alt={`${project.name} primary screenshot`}
              priority
            />
          </div>
        ) : null}

        <OverviewTableOfContents items={tocItems}>
          <div className="overview-case__article">
            {sections.map((section) => (
              <div key={section.id}>{section.render()}</div>
            ))}
          </div>
        </OverviewTableOfContents>

        <OverviewRelatedProjects projects={related} />
      </div>
    </article>
  );
}
