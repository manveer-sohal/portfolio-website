"use client";

import dynamic from "next/dynamic";
import { ContactFormFields } from "@/components/contact/ContactFormFields";
import { siteConfig } from "@/data/site";

const ContactFormPointer = dynamic(
  () =>
    import("@/components/home/ContactFormPointer").then(
      (mod) => mod.ContactFormPointer,
    ),
  {
    loading: () => null,
  },
);

/** Homepage contact block — same form + teal pointer animation. */
export function ContactForm() {
  return (
    <section
      className="contact-form-section"
      aria-labelledby="contact-form-heading"
    >
      <ContactFormPointer />
      <div className="contact-form-section__inner">
        <div className="contact-form-section__intro">
          <p className="contact-form-section__eyebrow">Get in touch</p>
          <h3
            id="contact-form-heading"
            className="contact-form-section__title"
          >
            Send a message
          </h3>
          <p className="contact-form-section__support">
            Tell me a bit about the role, collaboration, or product idea. Prefer
            email directly?{" "}
            <span className="contact-form-section__email">{siteConfig.email}</span>
          </p>
        </div>

        <ContactFormFields idPrefix="home-contact" />
      </div>
    </section>
  );
}
