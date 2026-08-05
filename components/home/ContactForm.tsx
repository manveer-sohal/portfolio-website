"use client";

import { useState, type FormEvent } from "react";
import { ContactFormPointer } from "@/components/home/ContactFormPointer";
import { mailtoHref, siteConfig } from "@/data/site";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedEmail || !trimmedMessage) return;

    const subject = `Portfolio inquiry from ${trimmedName}`;
    const body = [
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      "",
      trimmedMessage,
    ].join("\n");

    window.location.href = mailtoHref(subject) + `&body=${encodeURIComponent(body)}`;
    setStatus("ready");
  };

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
            <a href={mailtoHref()} className="contact-form-section__email">
              {siteConfig.email}
            </a>
          </p>
        </div>

        <form className="contact-form" onSubmit={onSubmit} noValidate>
          <div className="contact-form__row">
            <label className="contact-form__field">
              <span className="contact-form__label">Name</span>
              <input
                className="contact-form__input"
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="contact-form__field">
              <span className="contact-form__label">Email</span>
              <input
                className="contact-form__input"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
          </div>

          <label className="contact-form__field">
            <span className="contact-form__label">Message</span>
            <textarea
              className="contact-form__textarea"
              name="message"
              rows={5}
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>

          <div className="contact-form__footer">
            <button type="submit" className="contact-form__submit">
              Send message
              <span aria-hidden="true"> →</span>
            </button>
            <div className="contact-form__links">
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-form__link"
              >
                LinkedIn
              </a>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-form__link"
              >
                GitHub
              </a>
            </div>
          </div>

          {status === "ready" ? (
            <p className="contact-form__hint" role="status">
              Opening your email client with the message…
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
