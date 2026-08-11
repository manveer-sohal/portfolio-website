import type { Metadata } from "next";
import { OverviewContact } from "@/components/overview/OverviewContact";
import { OverviewExperienceItem } from "@/components/overview/OverviewExperienceItem";
import { OverviewIntro } from "@/components/overview/OverviewIntro";
import { OverviewOtherProject } from "@/components/overview/OverviewOtherProject";
import { OverviewProjectItem } from "@/components/overview/OverviewProjectItem";
import { OverviewRecognition } from "@/components/overview/OverviewRecognition";
import { awards } from "@/data/awards";
import { experience } from "@/data/experience";
import {
  getFeaturedProjects,
  getOtherProjects,
} from "@/data/projects";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} | Full-Stack Developer Overview`,
  },
  description:
    "A concise overview of Manveer Sohal’s projects, experience, and engineering work across full-stack development, backend systems, and AI-assisted products.",
  alternates: {
    canonical: "/overview",
  },
  openGraph: {
    title: `${siteConfig.name} | Full-Stack Developer Overview`,
    description:
      "A concise overview of projects, experience, and engineering work.",
    url: "/overview",
  },
};

export default function OverviewPage() {
  const featured = getFeaturedProjects();
  const other = getOtherProjects();
  const yearBySlug = Object.fromEntries(
    experience
      .filter((item) => item.projectSlug)
      .map((item) => [item.projectSlug!, item.year]),
  );

  return (
    <div className="overview-main overview-shell">
      <OverviewIntro />

      <section
        id="projects"
        className="overview-section"
        aria-labelledby="projects-heading"
      >
        <h2 id="projects-heading" className="overview-section__title">
          Selected Projects
        </h2>
        <div>
          {featured.map((project) => (
            <OverviewProjectItem
              key={project.slug}
              project={project}
              year={yearBySlug[project.slug]}
            />
          ))}
        </div>
      </section>

      <section
        id="experience"
        className="overview-section"
        aria-labelledby="experience-heading"
      >
        <h2 id="experience-heading" className="overview-section__title">
          Experience
        </h2>
        <div>
          {experience.map((item) => (
            <OverviewExperienceItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section
        id="other-projects"
        className="overview-section"
        aria-labelledby="other-projects-heading"
      >
        <h2 id="other-projects-heading" className="overview-section__title">
          Other Projects
        </h2>
        <div className="overview-other">
          {other.map((project) => (
            <OverviewOtherProject key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section
        id="recognition"
        className="overview-section"
        aria-labelledby="recognition-heading"
      >
        <h2 id="recognition-heading" className="overview-section__title">
          Recognition
        </h2>
        <OverviewRecognition awards={awards} />
      </section>

      <section
        id="contact"
        className="overview-section"
        aria-labelledby="contact-heading"
      >
        <OverviewContact />
      </section>
    </div>
  );
}
