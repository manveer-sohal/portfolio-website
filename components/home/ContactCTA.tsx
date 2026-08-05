export function ContactCTA() {
  return (
    <section
      id="contact"
      className="contact-banner"
      aria-labelledby="contact-heading"
    >
      <div className="contact-banner__grid" aria-hidden="true" />
      <p className="contact-banner__watermark" aria-hidden="true">
        connect
      </p>

      <div className="contact-banner__inner">
        <div className="contact-banner__copy">
          <h2 id="contact-heading" className="contact-banner__title">
            Contact Me!
          </h2>
          <p className="contact-banner__support">
            Open to full-stack, backend, and AI-focused roles — and conversations
            about Almaari, JobLinx, and product collaboration.
          </p>
        </div>
      </div>
    </section>
  );
}
