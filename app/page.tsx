import { AwardsBanner } from "@/components/home/AwardsBanner";
import { ContactCTA } from "@/components/home/ContactCTA";
import { ContactForm } from "@/components/home/ContactForm";
import { ContactRevealShell } from "@/components/home/ContactRevealShell";
import { ExperiencePreview } from "@/components/home/ExperiencePreview";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { OtherProjects } from "@/components/home/OtherProjects";
import { ProjectsExperienceBridge } from "@/components/home/ProjectsExperienceBridge";
import { SkillsSection } from "@/components/home/SkillsSection";
import { Footer } from "@/components/layout/Footer";
import { experience } from "@/data/experience";
import { getFeaturedProjects, getOtherProjects } from "@/data/projects";
import { skillCategories } from "@/data/skills";

export default function HomePage() {
  const featured = getFeaturedProjects();
  const other = getOtherProjects();

  return (
    <ContactRevealShell
      reveal={
        <>
          <ContactForm />
          <Footer />
        </>
      }
    >
      <Hero />
      <ProjectsExperienceBridge>
        <FeaturedProjects projects={featured} />
        <ExperiencePreview items={experience} />
      </ProjectsExperienceBridge>
      <SkillsSection categories={skillCategories} />
      <OtherProjects projects={other} />
      <AwardsBanner />
      {/* Teal Contact Me banner forms the rounded bottom of the sliding cover */}
      <ContactCTA />
    </ContactRevealShell>
  );
}
