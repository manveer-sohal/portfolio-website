import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { mailtoHref, siteConfig } from "@/data/site";

export function ContactCTA() {
  return (
    <section
      id="contact"
      className="section-space border-t border-border bg-section"
      aria-labelledby="contact-heading"
    >
      <div className="container-page">
        <Reveal>
          <div className="rounded-[14px] border border-border bg-surface-elevated p-8 md:p-10">
            <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-muted">
              Contact
            </p>
            <h2
              id="contact-heading"
              className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
            >
              Let’s build something useful.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-strong md:text-xl">
              I’m currently interested in full-stack, backend, and AI-focused
              software development opportunities. I’m also open to conversations
              about Almaari, JobLinx, and product collaboration.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={mailtoHref("Portfolio inquiry")}>Contact Me</Button>
              <Button href={siteConfig.links.linkedin} variant="secondary" external>
                LinkedIn
              </Button>
              <Button href={siteConfig.links.github} variant="ghost" external>
                GitHub
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
