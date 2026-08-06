"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/data/site";

type FormStatus = "idle" | "loading" | "success" | "error";

type ContactFormFieldsProps = {
  /** Optional id for the first focusable field / aria wiring */
  idPrefix?: string;
};

/**
 * Shared React contact form — posts to /api/contact (Resend).
 * Used on the homepage and /contact.
 */
export function ContactFormFields({ idPrefix = "contact" }: ContactFormFieldsProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const pending = status === "loading";

  const clearStatusOnEdit = () => {
    if (status !== "idle") {
      setStatus("idle");
      setFeedback(null);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    setStatus("loading");
    setFeedback(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setStatus("error");
        setFeedback(
          payload?.error ||
            "Something went wrong sending your message. Please try again.",
        );
        return;
      }

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setWebsite("");
      setStatus("success");
      setFeedback("Thanks — your message was sent. I’ll get back to you soon.");
    } catch {
      setStatus("error");
      setFeedback(
        "Couldn’t reach the server. Check your connection and try again — your message is still here.",
      );
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="contact-form__honeypot" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>
      </div>

      <div className="contact-form__row">
        <label className="contact-form__field" htmlFor={`${idPrefix}-name`}>
          <span className="contact-form__label">Name</span>
          <input
            id={`${idPrefix}-name`}
            className="contact-form__input"
            type="text"
            name="name"
            autoComplete="name"
            required
            disabled={pending}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearStatusOnEdit();
            }}
          />
        </label>
        <label className="contact-form__field" htmlFor={`${idPrefix}-email`}>
          <span className="contact-form__label">Email</span>
          <input
            id={`${idPrefix}-email`}
            className="contact-form__input"
            type="email"
            name="email"
            autoComplete="email"
            required
            disabled={pending}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearStatusOnEdit();
            }}
          />
        </label>
      </div>

      <label className="contact-form__field" htmlFor={`${idPrefix}-subject`}>
        <span className="contact-form__label">Subject</span>
        <input
          id={`${idPrefix}-subject`}
          className="contact-form__input"
          type="text"
          name="subject"
          autoComplete="off"
          required
          disabled={pending}
          value={subject}
          onChange={(event) => {
            setSubject(event.target.value);
            clearStatusOnEdit();
          }}
        />
      </label>

      <label className="contact-form__field" htmlFor={`${idPrefix}-message`}>
        <span className="contact-form__label">Message</span>
        <textarea
          id={`${idPrefix}-message`}
          className="contact-form__textarea"
          name="message"
          rows={5}
          required
          disabled={pending}
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            clearStatusOnEdit();
          }}
        />
      </label>

      <div className="contact-form__footer">
        <button
          type="submit"
          className="contact-form__submit"
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? "Sending…" : "Send message"}
          {!pending ? <span aria-hidden="true"> →</span> : null}
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

      <p
        className={
          status === "error"
            ? "contact-form__hint contact-form__hint--error"
            : status === "success"
              ? "contact-form__hint contact-form__hint--success"
              : "contact-form__hint"
        }
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {feedback ?? "\u00A0"}
      </p>
    </form>
  );
}
