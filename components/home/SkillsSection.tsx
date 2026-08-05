import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import type { SkillCategory } from "@/data/types";

type SkillsSectionProps = {
  categories: SkillCategory[];
};

export function SkillsSection({ categories }: SkillsSectionProps) {
  return (
    <section
      id="skills"
      className="section-space border-y border-border-subtle bg-section"
      aria-labelledby="skills-heading"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="skills-heading"
            eyebrow="Technical skills"
            title="Tools I use to ship"
          />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <Reveal key={category.name}>
              <div className="rounded-[14px] border border-border bg-surface p-5 md:p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {category.name}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
