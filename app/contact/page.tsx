import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { mailtoHref, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Manveer Sohal about full-stack, backend, and AI-focused software roles or product collaboration.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="section-space">
      <div className="container-page max-w-3xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let’s build something useful."
          description="I’m currently interested in full-stack, backend, and AI-focused software development opportunities. I’m also open to conversations about Almaari, JobLinx, and product collaboration."
        />
        <div className="rounded-[14px] border border-border bg-surface-elevated p-6 md:p-8">
          <p className="text-lg leading-relaxed text-muted-strong">
            Prefer email? Reach me at{" "}
            <a
              href={mailtoHref()}
              className="font-medium text-accent hover:text-accent-hover"
            >
              {siteConfig.email}
            </a>
            .
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={mailtoHref("Portfolio inquiry")}>Contact Me</Button>
            <Button href={siteConfig.links.linkedin} variant="secondary" external>
              LinkedIn
            </Button>
            <Button href={siteConfig.links.github} variant="ghost" external>
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
