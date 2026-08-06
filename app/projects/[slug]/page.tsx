import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { ProjectBrandFonts } from "@/components/theme/ProjectBrandFonts";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getAllProjectSlugs,
  getProjectBySlug,
} from "@/data/projects";
import { siteConfig } from "@/data/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.name} Case Study | ${siteConfig.name}`;

  return {
    title: {
      absolute: title,
    },
    description: project.shortDescription,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title,
      description: project.shortDescription,
      url: `/projects/${project.slug}`,
      ...(project.coverImage
        ? {
            images: [
              {
                url: project.coverImage,
                alt: `${project.name} screenshot`,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: project.coverImage ? "summary_large_image" : "summary",
      title,
      description: project.shortDescription,
      ...(project.coverImage ? { images: [project.coverImage] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.shortDescription,
    url: `${siteConfig.url}/projects/${project.slug}`,
    ...(project.coverImage
      ? { image: `${siteConfig.url}${project.coverImage}` }
      : {}),
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    keywords: project.technologies.join(", "),
  };

  return (
    <ProjectBrandFonts>
      <JsonLd data={projectJsonLd} />
      <ProjectDetails project={project} />
    </ProjectBrandFonts>
  );
}
