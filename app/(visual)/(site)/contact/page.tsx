import type { Metadata } from "next";
import { ContactFormFields } from "@/components/contact/ContactFormFields";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";

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

        <p className="mb-6 text-lg leading-relaxed text-muted-strong">
          Prefer email? Reach me at{" "}
          <span className="font-medium text-accent">{siteConfig.email}</span>.
        </p>

        <ContactFormFields idPrefix="page-contact" />
      </div>
    </div>
  );
}
