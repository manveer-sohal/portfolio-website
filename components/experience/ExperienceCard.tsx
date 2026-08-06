import Link from "next/link";
import { ExperienceTitleLine } from "@/components/experience/ExperienceTitleLine";
import { InlineEmphasis } from "@/components/ui/InlineEmphasis";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/data/types";

type ExperienceCardProps = {
  item: ExperienceItem;
  /** Cap bullets on homepage preview; omit for full list. */
  highlightLimit?: number;
  headingLevel?: "h2" | "h3";
  className?: string;
  /** When true, show homepage preview links instead of item.links. */
  previewLinks?: boolean;
  /** Hide period when it is shown on the timeline rail. */
  hidePeriod?: boolean;
};

export function ExperienceCard({
  item,
  highlightLimit,
  headingLevel = "h3",
  className,
  previewLinks = false,
  hidePeriod = false,
}: ExperienceCardProps) {
  const Heading = headingLevel;
  const highlights =
    highlightLimit != null
      ? item.highlights.slice(0, highlightLimit)
      : item.highlights;
  const metaParts = [
    hidePeriod ? null : item.period,
    item.location,
  ].filter(Boolean);

  return (
    <article className={cn("experience-card", className)}>
      <header className="experience-card__header">
        <div className="experience-card__heading">
          <Heading className="experience-card__role">{item.title}</Heading>
          <ExperienceTitleLine
            organization={item.organization}
            technologies={item.technologies}
            className="experience-card__title-line"
          />
          {metaParts.length > 0 ? (
            <p className="experience-card__meta">{metaParts.join(" · ")}</p>
          ) : null}
        </div>
        {item.achievement ? (
          <span className="experience-card__badge">{item.achievement}</span>
        ) : null}
      </header>

      <p className="experience-card__summary">{item.summary}</p>

      <ul className="experience-card__list">
        {highlights.map((highlight) => (
          <li key={highlight}>
            <InlineEmphasis text={highlight} />
          </li>
        ))}
      </ul>

      {previewLinks ? (
        item.projectSlug ? (
          <div className="experience-card__links">
            <Link
              href={`/projects/${item.projectSlug}`}
              className="experience-card__link experience-card__link--primary"
            >
              View Case Study
            </Link>
          </div>
        ) : null
      ) : item.links && item.links.length > 0 ? (
        <div className="experience-card__links">
          {item.links.map((link) =>
            link.type === "case-study" ? (
              <Link
                key={link.href}
                href={link.href}
                className="experience-card__link experience-card__link--primary"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="experience-card__link"
              >
                {link.label}
              </a>
            ),
          )}
        </div>
      ) : null}
    </article>
  );
}
