import Link from "next/link";
import { siteConfig } from "@/data/site";

export function OverviewIntro() {
  return (
    <header className="overview-intro">
      <p className="overview-intro__eyebrow">Overview</p>
      <h1 className="overview-intro__title">Hey, I&apos;m Manveer.</h1>
      <p className="overview-intro__lede">
        I&apos;m a full-stack developer building AI-assisted products, backend
        systems, and polished web experiences.
      </p>
      <p className="overview-intro__lede">
        I created Almaari and JobLinx, built multi-tenant AI systems such as
        SupportPilot, and worked on real-time computer-vision systems through
        Odin Analytica.
      </p>
      <p className="overview-intro__lede">
        Currently interested in full-stack, backend, and AI-focused software
        development opportunities.
      </p>
      <div className="overview-intro__links">
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
        <a className="overview-link" href={`mailto:${siteConfig.email}`}>
          Email
        </a>
        <Link className="overview-link" href="/" prefetch={false}>
          Main Portfolio
        </Link>
      </div>
    </header>
  );
}
