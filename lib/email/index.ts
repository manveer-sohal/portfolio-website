import { createResendProvider } from "./resend";
import type { EmailProvider } from "./types";

export type { ContactEmailPayload, EmailProvider } from "./types";

/**
 * Resolve the active email provider. Change this factory to swap vendors.
 */
export function getEmailProvider(): EmailProvider {
  const provider = (process.env.EMAIL_PROVIDER || "resend").toLowerCase();

  switch (provider) {
    case "resend":
      return createResendProvider();
    default:
      throw new Error(
        `Unsupported EMAIL_PROVIDER "${provider}". Supported: resend`,
      );
  }
}
