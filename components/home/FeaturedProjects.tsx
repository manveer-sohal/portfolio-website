import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FeaturedProjectSection } from "@/components/projects/FeaturedProjectSection";
import type { Project } from "@/data/types";

type FeaturedProjectsProps = {
  projects: Project[];
};

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section
      id="projects"
      className="featured-section section-space border-y border-border-subtle bg-section"
      aria-labelledby="featured-heading"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="featured-heading"
            title="Featured Projects"
            description="My projects I built to solve problems. Each built end to end with real engineering ownership."
            className="mb-0"
          />
        </Reveal>

        <div className="mt-10 space-y-10 md:mt-12 md:space-y-12">
          {projects.map((project, index) => (
            <Reveal key={project.slug} variant="feature">
              <FeaturedProjectSection
                project={project}
                priority={index === 0}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
