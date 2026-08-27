export function getProjectCaseStudyHref(slug: string): string {
  return slug === "almaari"
    ? "/projects/almaari/case-studies"
    : `/projects/${slug}`;
}

export function getProjectCaseStudyLabel(slug: string): string {
  return slug === "almaari" ? "View Case Studies" : "View Case Study";
}
