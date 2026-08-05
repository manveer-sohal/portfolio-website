import { AwardsBanner } from "@/components/home/AwardsBanner";
import { ContactCTA } from "@/components/home/ContactCTA";
import { ExperiencePreview } from "@/components/home/ExperiencePreview";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { OtherProjects } from "@/components/home/OtherProjects";
import { SkillsSection } from "@/components/home/SkillsSection";
import { experience } from "@/data/experience";
import { getFeaturedProjects, getOtherProjects } from "@/data/projects";
import { skillCategories } from "@/data/skills";

export default function HomePage() {
  const featured = getFeaturedProjects();
  const other = getOtherProjects().filter(
    (project) => project.slug !== "odin-analytica",
  );

  return (
    <>
      <Hero />
      <FeaturedProjects projects={featured} />
      <ExperiencePreview items={experience} />
      <SkillsSection categories={skillCategories} />
      <OtherProjects projects={other} />
      <AwardsBanner />
      <ContactCTA />
    </>
  );
}
