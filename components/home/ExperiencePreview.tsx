import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { ExperienceItem } from "@/data/types";

type ExperiencePreviewProps = {
  items: ExperienceItem[];
};

export function ExperiencePreview({ items }: ExperiencePreviewProps) {
  return (
    <section
      id="experience"
      className="section-space"
      aria-labelledby="experience-heading"
    >
      <div className="container-page experience-section-inner">
        <Reveal>
          <SectionHeading
            id="experience-heading"
            eyebrow="Experience"
            title="Product building in practice"
            description="Hands-on ownership across product engineering — not just feature tickets."
          />
        </Reveal>

        <ExperienceTimeline
          items={items}
          highlightLimit={4}
          headingLevel="h3"
          previewLinks
        />
      </div>
    </section>
  );
}
