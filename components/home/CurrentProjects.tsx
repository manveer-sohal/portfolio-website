import { currentProjects } from "@/data/current-projects";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CurrentProjectCard } from "./CurrentProjectCard";

export function CurrentProjects() {
  if (!currentProjects.length) return null;

  return (
    <section className="current-projects-section section-space" aria-labelledby="current-projects-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="current-projects-heading"
            eyebrow="In progress"
            title="Currently Building"
            description="Projects I’m actively building, testing, and iterating on."
          />
        </Reveal>
        <Reveal delayMs={80}>
          <div className="current-projects-section__list">
            {currentProjects.map((project) => <CurrentProjectCard key={project.slug} project={project} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
