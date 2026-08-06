export const siteConfig = {
  name: "Manveer Sohal",
  title: "Manveer Sohal | Full-Stack Developer Building AI-Powered Products",
  description:
    "Portfolio of Manveer Sohal, a full-stack developer building AI-assisted products, backend systems, and polished web applications including Almaari, JobLinx, and SupportPilot.",
  /**
   * Canonical site origin. Used for metadataBase, OG/Twitter images, sitemap, robots, JSON-LD.
   * Keep this on the Vercel production domain (or a custom domain) — not GitHub Pages.
   */
  url: "https://manveersohal.com",
  locale: "en_CA",
  location: "Ontario, Canada",
  openTo:
    "Open to full-stack, backend, and AI-focused software development opportunities",
  /** Primary professional contact email — destination for contact form delivery. */
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
