import Link from "next/link";
import type { ExperienceItem } from "@/data/types";
import { OverviewReveal } from "./OverviewReveal";

type OverviewExperienceItemProps = {
  item: ExperienceItem;
};

function stripMd(text: string) {
  return text.replace(/\*\*/g, "");
}

export function OverviewExperienceItem({ item }: OverviewExperienceItemProps) {
  const bullets = item.highlights.slice(0, 3).map(stripMd);
  const caseLink = item.projectSlug
    ? `/overview/projects/${item.projectSlug}`
    : item.links?.find((l) => l.type === "case-study")?.href;
  const external =
    item.links?.find((l) => l.type === "live" || l.type === "devpost" || l.type === "website") ??
    null;

  return (
    <OverviewReveal>
      <p className="overview-item__meta">
        {[item.title, item.year].filter(Boolean).join(" · ")}
      </p>
      <h3 className="overview-item__title">{item.organization}</h3>
      <p className="overview-item__body">{item.summary}</p>
      <ul className="overview-item__bullets">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      {(caseLink || external) && (
        <div className="overview-item__links">
          {caseLink ? (
            <Link href={caseLink} className="overview-link">
              Read case study →
            </Link>
          ) : null}
          {external ? (
            <a
              href={external.href}
              className="overview-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {external.label}
            </a>
          ) : null}
        </div>
      )}
    </OverviewReveal>
  );
}
