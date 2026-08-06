export type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

/**
 * Provider-agnostic email sender. Swap Resend for SendGrid/Postmark/SES
 * by implementing this interface in lib/email/*.
 */
export type EmailProvider = {
  sendContactEmail: (payload: ContactEmailPayload) => Promise<void>;
};
