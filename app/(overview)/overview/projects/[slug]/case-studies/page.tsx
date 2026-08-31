import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { almaariCaseStudies } from "@/data/almaari-case-studies";
import { siteConfig } from "@/data/site";

type PageProps = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: {
    absolute: `Almaari Engineering Case Studies | ${siteConfig.name}`,
  },
  description:
    "A concise collection of Almaari product engineering, AI workflow, reliability, and system-design case studies.",
  alternates: { canonical: "/projects/almaari/case-studies" },
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return [{ slug: "almaari" }];
}

function overviewHref(slug: string) {
  return slug === "product-engineering"
    ? "/overview/projects/almaari"
    : `/overview/projects/almaari/case-studies/${slug}`;
}

export default async function OverviewAlmaariCaseStudiesPage({
  params,
}: PageProps) {
  const { slug } = await params;
  if (slug !== "almaari") notFound();

  return (
    <main className="overview-case overview-case-hub">
      <div className="overview-case__shell">
        <Link href="/overview#projects" className="overview-case__back">
          ← Back to projects
        </Link>

        <header>
          <p className="overview-case__eyebrow">Almaari</p>
          <h1 className="overview-case__title">Engineering Case Studies</h1>
          <p className="overview-case__lede">
            Concise technical deep dives into Almaari&apos;s product engineering,
            AI workflows, reliability, and system design.
          </p>
        </header>

        <div className="overview-case-hub__list">
          {almaariCaseStudies.map((study) => (
            <article key={study.slug} className="overview-case-hub__study">
              <p className="overview-case-hub__meta">
                <span>{study.status.replace("-", " ")}</span>
                <span aria-hidden="true">·</span>
                <span>{study.updatedAt}</span>
              </p>
              <h2 className="overview-case-hub__title">
                <Link href={overviewHref(study.slug)}>{study.title}</Link>
              </h2>
              <p className="overview-case-hub__summary">{study.summary}</p>
              <p className="overview-case-hub__themes">
                {study.themes.join(" · ")}
              </p>
              <Link
                href={overviewHref(study.slug)}
                className="overview-link overview-case-hub__link"
              >
                Read case study →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
