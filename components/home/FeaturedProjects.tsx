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
            eyebrow="Featured Projects"
            title="Projects I'm proud of"
            description="My projects I built to solve problems. Each built end to end with real engineering ownership."
            className="mb-0"
          />
        </Reveal>

        <div className="  space-y-2   md:space-y-3 ">
          {projects.map((project, index) => (
            <Reveal key={project.slug} variant="feature">
              <FeaturedProjectSection
                project={project}
                priority={index === 0}
                mediaSide={index % 2 === 0 ? "left" : "right"}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
