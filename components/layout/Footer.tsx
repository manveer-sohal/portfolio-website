import Link from "next/link";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="container-page flex flex-col gap-4 py-10 text-base text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/projects" className="font-medium text-muted-strong hover:text-foreground">
            Projects
          </Link>
          <Link href="/experience" className="font-medium text-muted-strong hover:text-foreground">
            Experience
          </Link>
          <Link href="/contact" className="font-medium text-muted-strong hover:text-foreground">
            Contact
          </Link>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-muted-strong hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-muted-strong hover:text-foreground"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
