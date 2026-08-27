import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlmaariCaseStudyCard } from "@/components/projects/case-study/AlmaariCaseStudyCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { almaariCaseStudies } from "@/data/almaari-case-studies";
import { siteConfig } from "@/data/site";

type PageProps = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: `Almaari Engineering Case Studies | ${siteConfig.name}`,
  description:
    "Technical deep dives into Almaari's product engineering, AI workflows, reliability, and system design.",
  alternates: { canonical: "/projects/almaari/case-studies" },
};

export function generateStaticParams() {
  return [{ slug: "almaari" }];
}

export default async function AlmaariCaseStudiesPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug !== "almaari") notFound();

  return (
    <main className="case-study case-study-hub">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Almaari Engineering Case Studies",
          url: `${siteConfig.url}/projects/almaari/case-studies`,
          hasPart: almaariCaseStudies.map((study) => ({
            "@type": "CreativeWork",
            name: study.title,
            url: `${siteConfig.url}${study.href}`,
          })),
        }}
      />
      <div className="case-study__shell">
        <Link href="/#projects" className="case-study__back">← Back to projects</Link>
        <header className="case-study-hub__header">
          <p className="case-study__eyebrow">Almaari</p>
          <h1>Engineering Case Studies</h1>
          <p>
            A collection of technical deep dives into architecture, product engineering,
            reliability, AI workflows, and system design.
          </p>
        </header>
        <div className="case-study-hub__grid">
          {almaariCaseStudies.map((study) => (
            <AlmaariCaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
      </div>
    </main>
  );
}
