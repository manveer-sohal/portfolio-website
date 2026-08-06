export type ContactInput = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot — must be empty for humans */
  website?: unknown;
};

export type ValidatedContact = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** True when honeypot was filled (treat as bot; do not send) */
  isSpam: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

export type ValidationResult =
  | { ok: true; data: ValidatedContact }
  | { ok: false; error: string };

export function validateContactInput(input: ContactInput): ValidationResult {
  const honeypot =
    typeof input.website === "string" ? input.website.trim() : "";

  // Silent spam path — still "valid" so bots get a fake success
  if (honeypot.length > 0) {
    return {
      ok: true,
      data: {
        name: "spam",
        email: "spam@example.com",
        subject: "spam",
        message: "spam",
        isSpam: true,
      },
    };
  }

  const name = asTrimmedString(input.name, 120);
  const email = asTrimmedString(input.email, 254);
  const subject = asTrimmedString(input.subject, 160);
  const message = asTrimmedString(input.message, 5000);

  if (!name) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!subject) {
    return { ok: false, error: "Please enter a subject." };
  }
  if (!message || message.length < 10) {
    return {
      ok: false,
      error: "Please enter a message (at least 10 characters).",
    };
  }

  return {
    ok: true,
    data: { name, email, subject, message, isSpam: false },
  };
}
