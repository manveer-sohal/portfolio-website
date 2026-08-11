import type { ReactNode } from "react";
import type { Project } from "@/data/types";
import { buildAtAGlanceItems } from "@/components/projects/case-study/CaseStudyAtAGlance";
import { groupTechnologies } from "@/components/projects/case-study/CaseStudyStack";
import { OverviewCaseStudyCallout } from "./OverviewCaseStudyCallout";
import { OverviewCaseStudyMedia } from "./OverviewCaseStudyMedia";
import { OverviewCaseStudySection } from "./OverviewCaseStudySection";

export type OverviewCaseStudySectionDef = {
  id: string;
  label: string;
  render: () => ReactNode;
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="overview-case__list">
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

export function buildOverviewCaseStudySections(
  project: Project,
): OverviewCaseStudySectionDef[] {
  const sections: OverviewCaseStudySectionDef[] = [];

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
        <OverviewCaseStudySection id="overview" title="Overview">
          {overviewDistinct(project) ? (
            <div className="overview-case__prose">
              <p>{project.fullDescription}</p>
            </div>
          ) : null}
          {glanceItems.length > 0 ? (
            <div className="overview-case__glance" style={{ marginTop: "1.35rem" }}>
              {glanceItems.map((item) => (
                <div key={item.label} className="overview-case__glance-item">
                  <p className="overview-case__glance-label">{item.label}</p>
                  <p className="overview-case__glance-value">{item.value}</p>
                </div>
              ))}
            </div>
          ) : null}
        </OverviewCaseStudySection>
      ),
    });
  }

  if (project.problem?.length) {
    sections.push({
      id: "problem",
      label: "The problem",
      render: () => (
        <OverviewCaseStudySection id="problem" title="The problem">
          <BulletList items={project.problem!} />
        </OverviewCaseStudySection>
      ),
    });
  }

  if (project.solution?.length) {
    sections.push({
      id: "solution",
      label: "The solution",
      render: () => (
        <OverviewCaseStudySection id="solution" title="The solution">
          <BulletList items={project.solution!} />
        </OverviewCaseStudySection>
      ),
    });
  }

  if (project.contributions?.length) {
    sections.push({
      id: "ownership",
      label: "What I built",
      render: () => (
        <OverviewCaseStudySection id="ownership" title="What I built">
          <BulletList items={project.contributions!} />
        </OverviewCaseStudySection>
      ),
    });
  }

  if (project.metrics.length > 0) {
    sections.push({
      id: "results",
      label: "Key results",
      render: () => (
        <OverviewCaseStudySection id="results" title="Key results">
          <div className="overview-case__metrics">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="overview-case__metric">
                <p className="overview-case__metric-value">{metric.value}</p>
                <p className="overview-case__metric-label">{metric.label}</p>
                {metric.description ? (
                  <p className="overview-case__metric-desc">
                    {metric.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </OverviewCaseStudySection>
      ),
    });
  }

  if (project.features?.length) {
    sections.push({
      id: "product-flow",
      label: "Product flow",
      render: () => (
        <OverviewCaseStudySection id="product-flow" title="Product flow">
          <ol className="overview-case__steps">
            {project.features!.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ol>
        </OverviewCaseStudySection>
      ),
    });
  }

  if (project.architecture?.length) {
    sections.push({
      id: "architecture",
      label: "Architecture",
      render: () => (
        <OverviewCaseStudySection id="architecture" title="Architecture">
          <p className="overview-case__prose" style={{ marginTop: "0.85rem" }}>
            High-level system pieces involved in the product.
          </p>
          <ol className="overview-case__arch-list">
            {project.architecture!.map((item, index) => (
              <li key={item} className="overview-case__arch-item">
                <span className="overview-case__arch-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="overview-case__arch-text">{item}</p>
              </li>
            ))}
          </ol>
        </OverviewCaseStudySection>
      ),
    });
  }

  if (project.technicalDecisions?.length) {
    sections.push({
      id: "technical-decisions",
      label: "Technical decisions",
      render: () => (
        <OverviewCaseStudySection
          id="technical-decisions"
          title="Technical decisions"
        >
          <div>
            {project.technicalDecisions!.map((decision) => (
              <OverviewCaseStudyCallout
                key={decision.title}
                variant="decision"
                title={decision.title}
              >
                {decision.description}
              </OverviewCaseStudyCallout>
            ))}
          </div>
        </OverviewCaseStudySection>
      ),
    });
  }

  if (project.tradeoffs?.length) {
    sections.push({
      id: "trade-offs",
      label: "Trade-offs",
      render: () => (
        <OverviewCaseStudySection
          id="trade-offs"
          title="Challenges and trade-offs"
        >
          <div>
            {project.tradeoffs!.map((tradeoff) => (
              <OverviewCaseStudyCallout
                key={tradeoff.title}
                variant="tradeoff"
                title={tradeoff.title}
              >
                {tradeoff.description}
              </OverviewCaseStudyCallout>
            ))}
          </div>
        </OverviewCaseStudySection>
      ),
    });
  }

  if (project.technologies.length > 0) {
    const groups = groupTechnologies(project.technologies);
    sections.push({
      id: "technology-stack",
      label: "Technology stack",
      render: () => (
        <OverviewCaseStudySection
          id="technology-stack"
          title="Technology stack"
        >
          <dl className="overview-case__stack">
            {groups.map((group) => (
              <div key={group.label}>
                <dt>{group.label}</dt>
                <dd>{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </OverviewCaseStudySection>
      ),
    });
  }

  if (project.gallery?.length) {
    sections.push({
      id: "gallery",
      label: "Screenshots",
      render: () => (
        <OverviewCaseStudySection id="gallery" title="Screenshots">
          <div className="overview-case__gallery">
            {project.gallery!.map((item) => (
              <OverviewCaseStudyMedia
                key={item.src}
                src={item.src}
                alt={item.alt}
                caption={item.caption}
                sizes="(max-width: 768px) 100vw, 22rem"
              />
            ))}
          </div>
        </OverviewCaseStudySection>
      ),
    });
  }

  return sections;
}
