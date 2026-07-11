import type { Metadata } from "next";
import { Check, X } from "lucide-react";

import { setBookingStatus } from "@/actions/booking";
import { DataTablePagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/types/database";

export const metadata: Metadata = { title: "Bookings" };

const PAGE_SIZE = 15;

function statusVariant(status: BookingStatus) {
  if (status === "confirmed") return "default" as const;
  if (status === "cancelled") return "destructive" as const;
  return "secondary" as const;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireRole("editor");
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const supabase = await createClient();
  const { data: bookings, count } = await supabase
    .from("bookings")
    .select("*", { count: "exact" })
    .order("starts_at", { ascending: true })
    .gte("starts_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const pageCount = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading text-2xl">Bookings</h1>
        <p className="text-muted-foreground text-sm">
          Upcoming appointments (yesterday onward). Deposit-paid bookings confirm automatically.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-28">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {new Date(booking.starts_at).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <p>{booking.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {booking.email}
                      {booking.phone ? ` · ${booking.phone}` : ""}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(booking.status)} className="capitalize">
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-48 truncate">
                    {booking.notes ?? "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {booking.status !== "confirmed" ? (
                        <form action={setBookingStatus}>
                          <input type="hidden" name="id" value={booking.id} />
                          <input type="hidden" name="status" value="confirmed" />
                          <Button type="submit" variant="ghost" size="icon" aria-label="Confirm">
                            <Check className="size-4" />
                          </Button>
                        </form>
                      ) : null}
                      {booking.status !== "cancelled" ? (
                        <form action={setBookingStatus}>
                          <input type="hidden" name="id" value={booking.id} />
                          <input type="hidden" name="status" value="cancelled" />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            aria-label="Cancel"
                            className="hover:text-destructive"
                          >
                            <X className="size-4" />
                          </Button>
                        </form>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                  No upcoming bookings.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination basePath="/admin/bookings" page={page} pageCount={pageCount} />
    </div>
  );
}
