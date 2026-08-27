import Link from "next/link";
import type { AlmaariCaseStudy } from "@/data/almaari-case-studies";

export function AlmaariCaseStudyCard({ study }: { study: AlmaariCaseStudy }) {
  return (
    <article className="case-study-hub__card">
      <div className="case-study-hub__card-meta">
        <span>Updated {study.updatedAt}</span>
      </div>
      <h2 className="case-study-hub__card-title">
        <Link href={study.href}>{study.title}</Link>
      </h2>
      <p className="case-study-hub__card-summary">{study.summary}</p>
      <ul className="case-study-hub__themes" aria-label="Technical themes">
        {study.themes.map((theme) => (
          <li key={theme}>{theme}</li>
        ))}
      </ul>
      <Link className="case-study-hub__card-link" href={study.href}>
        Read case study <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
