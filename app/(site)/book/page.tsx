import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck } from "lucide-react";

import { BookingForm } from "@/components/booking/booking-form";
import { SectionHeading } from "@/components/sections/section-heading";
import { Container, Section } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { getCapability } from "@/lib/capabilities";
import { getBookingSettings, getSlotsForDay } from "@/lib/booking/availability";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const capability = getCapability("booking");
  if (!capability.enabled) return {};
  return createMetadata({ title: capability.label ?? "Book", path: "/book" });
}

function toDateParam(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDay(value: string | undefined, maxAdvanceDays: number): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return today;

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return today;

  const max = new Date(today);
  max.setDate(max.getDate() + maxAdvanceDays);
  if (parsed < today) return today;
  if (parsed > max) return max;
  return parsed;
}

/**
 * Booking capability route.
 * provider "native": date navigation + slot grid + booking form.
 * provider "external": embeds the client's dedicated scheduler.
 */
export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; slot?: string; booked?: string }>;
}) {
  const settings = getBookingSettings();
  if (!settings.enabled) notFound();

  // External adapter: hand the page to the embedded scheduler.
  if (settings.provider === "external" && settings.externalEmbedUrl) {
    return (
      <Section>
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={settings.label}
            title={settings.label ?? "Book an appointment"}
          />
          <iframe
            src={settings.externalEmbedUrl}
            title="Booking"
            className="h-[720px] w-full rounded-xl border"
          />
        </Container>
      </Section>
    );
  }

  const { date, slot, booked } = await searchParams;
  const day = parseDay(date, settings.maxAdvanceDays);
  const slots = await getSlotsForDay(day);

  const previousDay = new Date(day);
  previousDay.setDate(previousDay.getDate() - 1);
  const nextDay = new Date(day);
  nextDay.setDate(nextDay.getDate() + 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedSlot = slot
    ? slots.find((s) => s.available && s.startsAt.toISOString() === slot)
    : undefined;

  const dayLabel = day.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Section>
      <Container className="flex max-w-2xl flex-col gap-10">
        <SectionHeading
          eyebrow={settings.label}
          title={settings.label ?? "Book an appointment"}
          description={`${settings.slotMinutes}-minute appointments. Pick a day and time.`}
        />

        {booked ? (
          <p
            role="status"
            className="flex items-center gap-2 rounded-md bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400"
          >
            <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
            Booking requested — we&apos;ll confirm by email shortly.
          </p>
        ) : null}

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/book?date=${toDateParam(previousDay)}`}
              aria-disabled={day <= today}
              tabIndex={day <= today ? -1 : undefined}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                day <= today && "pointer-events-none opacity-50",
              )}
            >
              ← Previous
            </Link>
            <h2 className="text-center font-semibold">{dayLabel}</h2>
            <Link
              href={`/book?date=${toDateParam(nextDay)}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Next →
            </Link>
          </div>

          {slots.length === 0 ? (
            <p className="text-muted-foreground rounded-md border border-dashed p-10 text-center text-sm">
              Closed this day — try another date.
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((s) => {
                const iso = s.startsAt.toISOString();
                const label = s.startsAt.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });
                return (
                  <li key={iso}>
                    {s.available ? (
                      <Link
                        href={`/book?date=${toDateParam(day)}&slot=${encodeURIComponent(iso)}`}
                        className={cn(
                          buttonVariants({
                            variant:
                              selectedSlot?.startsAt.toISOString() === iso ? "default" : "outline",
                            size: "sm",
                          }),
                          "w-full tabular-nums",
                        )}
                      >
                        {label}
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "text-muted-foreground w-full line-through opacity-50",
                        )}
                      >
                        {label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {selectedSlot ? (
          <BookingForm
            startsAt={selectedSlot.startsAt.toISOString()}
            slotLabel={`${dayLabel} at ${selectedSlot.startsAt.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}`}
          />
        ) : (
          <p className="text-muted-foreground text-sm">Select a time above to continue.</p>
        )}
      </Container>
    </Section>
  );
}
