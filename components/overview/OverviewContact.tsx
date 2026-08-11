import { siteConfig } from "@/data/site";

export function OverviewContact() {
  return (
    <div className="overview-contact">
      <h2 className="overview-section__title" id="contact-heading">
        Get in touch
      </h2>
      <p className="overview-contact__body">
        I&apos;m interested in full-stack, backend, and AI-focused development
        opportunities.
      </p>
      <div className="overview-contact__links">
        <a className="overview-link" href={`mailto:${siteConfig.email}`}>
          Email
        </a>
        <a
          className="overview-link"
          href={siteConfig.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          className="overview-link"
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
