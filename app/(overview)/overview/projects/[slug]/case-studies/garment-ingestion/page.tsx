import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OverviewCaseStudyLayout } from "@/components/overview-case-study/OverviewCaseStudyLayout";
import { createGarmentIngestionOverviewProject } from "@/data/almaari-garment-ingestion-overview";
import { getProjectBySlug } from "@/data/projects";
import { siteConfig } from "@/data/site";

type PageProps = { params: Promise<{ slug: string }> };

const canonical = "/projects/almaari/case-studies/garment-ingestion";

export const metadata: Metadata = {
  title: {
    absolute: `Redesigning Almaari's AI Garment Ingestion Pipeline | ${siteConfig.name}`,
  },
  description:
    "A concise view of Almaari's asynchronous garment-ingestion redesign, durable workflow state, and retry strategy.",
  alternates: { canonical },
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return [{ slug: "almaari" }];
}

export default async function OverviewGarmentIngestionPage({
  params,
}: PageProps) {
  const { slug } = await params;
  if (slug !== "almaari") notFound();

  const almaari = getProjectBySlug("almaari");
  if (!almaari) notFound();
  const studyProject = createGarmentIngestionOverviewProject(almaari);

  return (
    <OverviewCaseStudyLayout
      project={studyProject}
      coverOverride={studyProject.coverImage}
    />
  );
}
