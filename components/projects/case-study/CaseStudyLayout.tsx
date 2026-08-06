import Link from "next/link";
import type { Project } from "@/data/types";
import { getProjectBySlug } from "@/data/projects";
import {
  getProjectTheme,
  resolveProjectCover,
} from "@/lib/project-themes";
import { CaseStudyHeader } from "./CaseStudyHeader";
import { CaseStudyMedia } from "./CaseStudyMedia";
import { CaseStudyMetadata } from "./CaseStudyMetadata";
import { CaseStudyTableOfContents } from "./CaseStudyTableOfContents";
import { RelatedProjects } from "./RelatedProjects";
import { buildCaseStudySections } from "./buildCaseStudySections";

type CaseStudyLayoutProps = {
  project: Project;
};

export function CaseStudyLayout({ project }: CaseStudyLayoutProps) {
  const theme = getProjectTheme(project.slug);
  const cover = resolveProjectCover(project);
  const hasCover = Boolean(cover);

  const live = project.links.find((link) => link.type === "live");
  const github = project.links.find((link) => link.type === "github");
  const website = project.links.find((link) => link.type === "website");
  const devpost = project.links.find((link) => link.type === "devpost");

  const sections = buildCaseStudySections(project);
  const tocItems = sections.map(({ id, label }) => ({ id, label }));

  const related = (project.relatedSlugs ?? [])
    .map((slug) => getProjectBySlug(slug))
    .filter((item): item is Project => Boolean(item));

  const focus = project.technologies.slice(0, 6);

  return (
    <article className="case-study">
      <div className="case-study__shell">
        <Link href="/#projects" className="case-study__back">
          ← Back to projects
        </Link>

        <CaseStudyHeader
          project={project}
          theme={theme}
          links={{ live, github, website, devpost }}
        />

        <CaseStudyMetadata
          role={project.role}
          status={project.status}
          focus={focus}
        />

        {hasCover ? (
          <div className="case-study__cover">
            <CaseStudyMedia
              src={cover}
              alt={`${project.name} primary screenshot`}
              priority
            />
          </div>
        ) : null}

        <CaseStudyTableOfContents items={tocItems}>
          <div className="case-study__article">
            {sections.map((section) => (
              <div key={section.id}>{section.render()}</div>
            ))}
          </div>
        </CaseStudyTableOfContents>

        <RelatedProjects projects={related} />
      </div>
    </article>
  );
}
