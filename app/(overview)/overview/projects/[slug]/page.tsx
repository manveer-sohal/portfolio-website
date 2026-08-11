import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OverviewCaseStudyLayout } from "@/components/overview-case-study/OverviewCaseStudyLayout";
import {
  getAllProjectSlugs,
  getProjectBySlug,
} from "@/data/projects";
import { siteConfig } from "@/data/site";

type OverviewProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: OverviewProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.name} Case Study | ${siteConfig.name}`;

  return {
    title: {
      absolute: title,
    },
    description: project.shortDescription,
    // Canonicalize to the primary visual case study to avoid duplicate SEO.
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title,
      description: project.shortDescription,
      url: `/overview/projects/${project.slug}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function OverviewProjectPage({
  params,
}: OverviewProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <OverviewCaseStudyLayout project={project} />;
}
