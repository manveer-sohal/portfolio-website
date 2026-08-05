import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getFeaturedProjects,
  getOtherProjects,
} from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies and product work by Manveer Sohal, including Almaari, JobLinx, SupportPilot, and earlier projects.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  const featured = getFeaturedProjects();
  const other = getOtherProjects();

  return (
    <div className="section-space">
      <div className="container-page">
        <SectionHeading
          eyebrow="Projects"
          title="All project work"
          description="Flagship products first, followed by earlier builds across realtime systems, analytics, games, and ML experiments."
        />
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-foreground">Featured</h2>
        <ProjectGrid projects={featured} />
        <h2 className="mb-5 mt-12 text-lg font-semibold tracking-tight text-foreground">
          Other projects
        </h2>
        <ProjectGrid projects={other} />
      </div>
    </div>
  );
}
