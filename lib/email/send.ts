import "server-only";

import { Resend } from "resend";

import { env } from "@/lib/env";
import { createLogger } from "@/lib/log";

const log = createLogger("email");

/**
 * Email dispatch via Resend.
 *
 * Degrades gracefully: without RESEND_API_KEY the send is skipped and logged,
 * so forms keep working (submissions are still stored) before email is set up
 * for a client. Failures never throw — a broken mailbox must not break a
 * form submission that's already saved.
 */

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  react: React.ReactNode;
  replyTo?: string;
};

export async function sendEmail(options: SendEmailOptions): Promise<{ sent: boolean }> {
  if (!env.RESEND_API_KEY) {
    log.warn("RESEND_API_KEY not set — email skipped", { subject: options.subject });
    return { sent: false };
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      react: options.react,
      replyTo: options.replyTo,
    });

    if (error) {
      log.error("send failed", { error: error.message });
      return { sent: false };
    }
    return { sent: true };
  } catch (error) {
    log.error("send threw", { error: error instanceof Error ? error.message : String(error) });
    return { sent: false };
  }
}
