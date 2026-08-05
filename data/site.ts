export const siteConfig = {
  name: "Manveer Sohal",
  title: "Manveer Sohal | Full-Stack Developer Building AI-Powered Products",
  description:
    "Portfolio of Manveer Sohal, a full-stack developer building AI-assisted products, backend systems, and polished web applications including Almaari, JobLinx, and SupportPilot.",
  /**
   * Update this to the final production domain before deployment.
   * All metadataBase, canonical, sitemap, robots, and Open Graph URLs derive from this value.
   */
  url: "https://manveer-sohal.github.io/portfolio-website",
  locale: "en_CA",
  location: "Ontario, Canada",
  openTo:
    "Open to full-stack, backend, and AI-focused software development opportunities",
  /** Primary professional contact email — used for mailto links and the contact page. */
  email: "manveersohalwork@gmail.com",
  links: {
    github: "https://github.com/manveer-sohal",
    linkedin: "https://www.linkedin.com/in/manveersohal/",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Experience", href: "/experience" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export function mailtoHref(subject?: string): string {
  const address = siteConfig.email;
  if (!subject) return `mailto:${address}`;
  return `mailto:${address}?subject=${encodeURIComponent(subject)}`;
}
