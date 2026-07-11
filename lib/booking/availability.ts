import { getCapability } from "@/lib/capabilities";
import { createClient } from "@/lib/supabase/server";

/**
 * Native booking availability.
 *
 * Slots are generated from the weekly opening template in the booking
 * capability config, then existing bookings (fetched via the PII-free
 * get_booked_ranges function) are subtracted. The database exclusion
 * constraint remains the final authority — this layer is UX.
 */

export type Slot = { startsAt: Date; available: boolean };

export const BOOKING_DEFAULTS = {
  slotMinutes: 30,
  leadHours: 12,
  maxAdvanceDays: 30,
  weeklyHours: {
    1: { open: "09:00", close: "17:00" },
    2: { open: "09:00", close: "17:00" },
    3: { open: "09:00", close: "17:00" },
    4: { open: "09:00", close: "17:00" },
    5: { open: "09:00", close: "17:00" },
  },
} as const;

type WeeklyHours = Partial<
  Record<0 | 1 | 2 | 3 | 4 | 5 | 6, { open: string; close: string } | null>
>;

export function getBookingSettings() {
  const capability = getCapability("booking");
  return {
    ...capability,
    slotMinutes: capability.slotMinutes ?? BOOKING_DEFAULTS.slotMinutes,
    leadHours: capability.leadHours ?? BOOKING_DEFAULTS.leadHours,
    maxAdvanceDays: capability.maxAdvanceDays ?? BOOKING_DEFAULTS.maxAdvanceDays,
    weeklyHours: (capability.weeklyHours ?? BOOKING_DEFAULTS.weeklyHours) as WeeklyHours,
  };
}

function parseTime(day: Date, time: string): Date {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  const result = new Date(day);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** All slots for a calendar day, marked available or taken. */
export async function getSlotsForDay(day: Date): Promise<Slot[]> {
  const settings = getBookingSettings();
  const weekday = day.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const window = settings.weeklyHours[weekday];
  if (!window) return [];

  const open = parseTime(day, window.open);
  const close = parseTime(day, window.close);
  const earliest = new Date(Date.now() + settings.leadHours * 60 * 60 * 1000);
  const latest = new Date(Date.now() + settings.maxAdvanceDays * 24 * 60 * 60 * 1000);

  const dayStart = new Date(day);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const supabase = await createClient();
  const { data: booked } = await supabase.rpc("get_booked_ranges", {
    from_ts: dayStart.toISOString(),
    to_ts: dayEnd.toISOString(),
  });

  const bookedRanges = (booked ?? []).map((range) => {
    const start = new Date(range.starts_at);
    return { start, end: new Date(start.getTime() + range.duration_minutes * 60 * 1000) };
  });

  const slots: Slot[] = [];
  const stepMs = settings.slotMinutes * 60 * 1000;
  for (let time = open.getTime(); time + stepMs <= close.getTime(); time += stepMs) {
    const startsAt = new Date(time);
    const endsAt = new Date(time + stepMs);
    const withinBookingWindow = startsAt >= earliest && startsAt <= latest;
    const taken = bookedRanges.some((range) => overlaps(startsAt, endsAt, range.start, range.end));
    slots.push({ startsAt, available: withinBookingWindow && !taken });
  }
  return slots;
}
