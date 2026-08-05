import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import type { Project } from "@/data/types";

type OtherProjectsProps = {
  projects: Project[];
};

export function OtherProjects({ projects }: OtherProjectsProps) {
  return (
    <section className="section-space" aria-labelledby="other-projects-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="other-projects-heading"
            eyebrow="Additional work"
            title="Other projects"
            description="Earlier and smaller builds that still show range across realtime systems, analytics, games, and ML experiments."
          />
        </Reveal>
        <Reveal>
          <ProjectGrid projects={projects} />
        </Reveal>
      </div>
    </section>
  );
}
