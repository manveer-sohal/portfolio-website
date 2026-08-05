import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Product-building experience across Almaari, Odin Analytica, and Almaari Decor by Manveer Sohal.",
  alternates: {
    canonical: "/experience",
  },
};

export default function ExperiencePage() {
  return (
    <div className="section-space">
      <div className="container-page experience-section-inner">
        <SectionHeading
          eyebrow="Experience"
          title="Where I’ve built and shipped"
          description="A focused look at product ownership, systems work, and measurable engineering outcomes."
        />
        <ExperienceTimeline items={experience} headingLevel="h2" />
      </div>
    </div>
  );
}
