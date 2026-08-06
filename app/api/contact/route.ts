import { NextResponse } from "next/server";
import { getEmailProvider } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/contact/rate-limit";
import { validateContactInput } from "@/lib/contact/validate";

export const runtime = "nodejs";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error:
          "Too many messages from this network. Please try again in a little while.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSec) },
      },
    );
  }

  const validated = validateContactInput(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  // Honeypot trip — pretend success without sending
  if (validated.data.isSpam) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    const provider = getEmailProvider();
    await provider.sendContactEmail({
      name: validated.data.name,
      email: validated.data.email,
      subject: validated.data.subject,
      message: validated.data.message,
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong sending your message. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
