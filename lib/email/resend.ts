import { Resend } from "resend";
import { siteConfig } from "@/data/site";
import type { ContactEmailPayload, EmailProvider } from "./types";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function formatContactEmail(payload: ContactEmailPayload) {
  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    "",
    "Message:",
    "",
    payload.message,
  ].join("\n");

  return {
    subject: `Portfolio Contact — ${payload.subject}`,
    text,
  };
}

/**
 * Resend-backed contact mailer. Keep secrets server-side only.
 */
export function createResendProvider(): EmailProvider {
  const apiKey = requireEnv("RESEND_API_KEY");
  const from = requireEnv("CONTACT_FROM_EMAIL");
  const to = process.env.CONTACT_TO_EMAIL?.trim() || siteConfig.email;

  const resend = new Resend(apiKey);

  return {
    async sendContactEmail(payload) {
      const { subject, text } = formatContactEmail(payload);
      const result = await resend.emails.send({
        from,
        to: [to],
        replyTo: payload.email,
        subject,
        text,
      });

      if (result.error) {
        throw new Error(result.error.message || "Resend failed to send email");
      }
    },
  };
}
