import type { ReactNode } from "react";
import type { Project } from "@/data/types";
import {
  CaseStudyAtAGlance,
  buildAtAGlanceItems,
} from "./CaseStudyAtAGlance";
import { CaseStudyCallout } from "./CaseStudyCallout";
import { CaseStudyMedia } from "./CaseStudyMedia";
import { CaseStudyMetrics } from "./CaseStudyMetrics";
import { CaseStudySection } from "./CaseStudySection";
import { CaseStudyStack } from "./CaseStudyStack";

export type CaseStudySectionDef = {
  id: string;
  label: string;
  render: () => ReactNode;
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="case-study__list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function overviewDistinct(project: Project): boolean {
  const short = project.shortDescription.trim().toLowerCase();
  const full = project.fullDescription.trim().toLowerCase();
  return Boolean(full) && full !== short;
}

export function buildCaseStudySections(
  project: Project,
): CaseStudySectionDef[] {
  const sections: CaseStudySectionDef[] = [];

  const glanceItems = buildAtAGlanceItems({
    shortDescription: project.shortDescription,
    problemSummary: project.problemSummary,
    role: project.role,
    contributions: project.contributions,
    firstMetric: project.metrics[0],
  });

  if (overviewDistinct(project) || glanceItems.length > 0) {
    sections.push({
      id: "overview",
      label: "Overview",
      render: () => (
        <CaseStudySection id="overview" eyebrow="Context" title="Overview">
          {overviewDistinct(project) ? (
            <div className="case-study__prose">
              <p>{project.fullDescription}</p>
            </div>
          ) : null}
          {glanceItems.length > 0 ? (
            <>
              <p className="case-study__section-intro" style={{ marginTop: "1.5rem" }}>
                At a glance
              </p>
              <CaseStudyAtAGlance items={glanceItems} />
            </>
          ) : null}
        </CaseStudySection>
      ),
    });
  }

  if (project.problem?.length) {
    sections.push({
      id: "problem",
      label: "Problem",
      render: () => (
        <CaseStudySection id="problem" eyebrow="Context" title="The problem">
          <BulletList items={project.problem!} />
        </CaseStudySection>
      ),
    });
  }

  if (project.solution?.length) {
    sections.push({
      id: "solution",
      label: "Solution",
      render: () => (
        <CaseStudySection id="solution" eyebrow="Approach" title="The solution">
          <BulletList items={project.solution!} />
        </CaseStudySection>
      ),
    });
  }

  if (project.contributions?.length) {
    sections.push({
      id: "ownership",
      label: "Ownership",
      render: () => (
        <CaseStudySection
          id="ownership"
          eyebrow="Role"
          title="What I owned"
        >
          <BulletList items={project.contributions!} />
        </CaseStudySection>
      ),
    });
  }

  if (project.metrics.length > 0) {
    sections.push({
      id: "results",
      label: "Results",
      render: () => (
        <CaseStudySection
          id="results"
          eyebrow="Outcomes"
          title="Key results"
        >
          <CaseStudyMetrics metrics={project.metrics} />
        </CaseStudySection>
      ),
    });
  }

  if (project.features?.length) {
    sections.push({
      id: "flow",
      label: "Product flow",
      render: () => (
        <CaseStudySection
          id="flow"
          eyebrow="Product"
          title="Core product flow"
        >
          <ol className="case-study__steps">
            {project.features!.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ol>
        </CaseStudySection>
      ),
    });
  }

  if (project.architecture?.length) {
    sections.push({
      id: "architecture",
      label: "Architecture",
      render: () => (
        <CaseStudySection
          id="architecture"
          eyebrow="System"
          title="Architecture"
          intro="High-level system pieces involved in the product."
        >
          <ol className="case-study__arch-list">
            {project.architecture!.map((item, index) => (
              <li key={item} className="case-study__arch-item">
                <span className="case-study__arch-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="case-study__arch-text">{item}</p>
              </li>
            ))}
          </ol>
        </CaseStudySection>
      ),
    });
  }

  if (project.technicalDecisions?.length) {
    sections.push({
      id: "decisions",
      label: "Decisions",
      render: () => (
        <CaseStudySection
          id="decisions"
          eyebrow="Engineering"
          title="Important decisions"
        >
          <div>
            {project.technicalDecisions!.map((decision) => (
              <CaseStudyCallout
                key={decision.title}
                variant="decision"
                title={decision.title}
              >
                {decision.description}
              </CaseStudyCallout>
            ))}
          </div>
        </CaseStudySection>
      ),
    });
  }

  if (project.tradeoffs?.length) {
    sections.push({
      id: "trade-offs",
      label: "Trade-offs",
      render: () => (
        <CaseStudySection
          id="trade-offs"
          eyebrow="Constraints"
          title="Challenges and trade-offs"
        >
          <div>
            {project.tradeoffs!.map((tradeoff) => (
              <CaseStudyCallout
                key={tradeoff.title}
                variant="tradeoff"
                title={tradeoff.title}
              >
                {tradeoff.description}
              </CaseStudyCallout>
            ))}
          </div>
        </CaseStudySection>
      ),
    });
  }

  if (project.technologies.length > 0) {
    sections.push({
      id: "stack",
      label: "Stack",
      render: () => (
        <CaseStudySection
          id="stack"
          eyebrow="Tools"
          title="Technology stack"
        >
          <CaseStudyStack technologies={project.technologies} />
        </CaseStudySection>
      ),
    });
  }

  if (project.gallery?.length) {
    sections.push({
      id: "gallery",
      label: "Gallery",
      render: () => (
        <CaseStudySection
          id="gallery"
          eyebrow="Visuals"
          title="Additional screenshots"
        >
          <div className="case-study__gallery">
            {project.gallery!.map((item) => (
              <CaseStudyMedia
                key={item.src}
                src={item.src}
                alt={item.alt}
                caption={item.caption}
                sizes="(max-width: 768px) 100vw, 32rem"
              />
            ))}
          </div>
        </CaseStudySection>
      ),
    });
  }

  return sections;
}
