"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { ContactNotificationEmail } from "@/emails/contact-notification";
import { requireRole } from "@/lib/auth";
import { getSlotsForDay, getBookingSettings } from "@/lib/booking/availability";
import { depositAmount } from "@/config/payments";
import { sendEmail } from "@/lib/email/send";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import { getStripe } from "@/lib/stripe";
import { createLogger } from "@/lib/log";
import { createClient } from "@/lib/supabase/server";

const log = createLogger("booking");

/**
 * Native booking actions. The DB exclusion constraint is the source of
 * truth for conflicts — a race between two customers resolves to exactly
 * one booking, and the loser gets a friendly retry message.
 */

export type BookingResult =
  { success: true; depositUrl?: string } | { success: false; message: string };

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email({ error: "Enter a valid email address" }),
  phone: z.string().max(30).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  startsAt: z.iso.datetime({ error: "Pick a time slot" }),
  /** Honeypot. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export async function createBooking(input: unknown): Promise<BookingResult> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await rateLimit(`booking:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!success) {
    return { success: false, message: "Too many attempts — please wait a minute." };
  }

  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid booking" };
  }

  const settings = getBookingSettings();
  if (!settings.enabled || settings.provider === "external") {
    return { success: false, message: "Online booking is not available." };
  }

  const startsAt = new Date(parsed.data.startsAt);

  // Server-side slot validation: the requested time must be a real,
  // currently-available slot (not just any timestamp the client sends).
  const slots = await getSlotsForDay(startsAt);
  const slot = slots.find((s) => s.startsAt.getTime() === startsAt.getTime());
  if (!slot || !slot.available) {
    return { success: false, message: "That time is no longer available — pick another slot." };
  }

  const supabase = await createClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      notes: parsed.data.notes || null,
      starts_at: startsAt.toISOString(),
      duration_minutes: settings.slotMinutes,
    })
    .select("id")
    .single();

  if (error || !booking) {
    // Exclusion constraint violation = someone beat them to the slot.
    if (error?.message.includes("bookings_no_overlap")) {
      return { success: false, message: "That time was just taken — pick another slot." };
    }
    log.error("insert failed", { error: error?.message });
    return { success: false, message: "Something went wrong — please try again." };
  }

  const when = startsAt.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  // Notify the owner; confirm to the customer. Both degrade without Resend.
  if (env.CONTACT_EMAIL) {
    await sendEmail({
      to: env.CONTACT_EMAIL,
      subject: `New booking request — ${when}`,
      replyTo: parsed.data.email,
      react: (
        <ContactNotificationEmail
          name={parsed.data.name}
          email={parsed.data.email}
          message={`Requested ${when}.${parsed.data.notes ? ` Notes: ${parsed.data.notes}` : ""}`}
        />
      ),
    });
  }

  revalidatePath("/book");
  revalidatePath("/admin/bookings");

  // Optional deposit: hand back a Stripe Checkout URL tied to this booking.
  if (settings.deposit && settings.depositBaseCents) {
    const stripe = getStripe();
    if (stripe) {
      const amount = depositAmount(settings.depositBaseCents, settings.deposit);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: amount,
              product_data: { name: `Booking deposit — ${when}` },
            },
          },
        ],
        metadata: { kind: "deposit", bookingId: booking.id },
        customer_email: parsed.data.email,
        success_url: `${env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/book?deposit=cancelled`,
      });
      if (session.url) {
        await supabase
          .from("bookings")
          .update({ deposit_session_id: session.id })
          .eq("id", booking.id);
        return { success: true, depositUrl: session.url };
      }
    }
  }

  return { success: true };
}

const statusSchema = z.object({
  id: z.uuid(),
  status: z.enum(["confirmed", "cancelled"]),
});

export async function setBookingStatus(formData: FormData): Promise<void> {
  await requireRole("editor");

  const parsed = statusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClient();
  await supabase.from("bookings").update({ status: parsed.data.status }).eq("id", parsed.data.id);

  revalidatePath("/book");
  revalidatePath("/admin/bookings");
}
