import type { Metadata } from "next";

import { DataTablePagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
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
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Payments" };

const PAGE_SIZE = 15;

type PaymentStatus = Database["public"]["Enums"]["payment_status"];

function statusVariant(status: PaymentStatus) {
  if (status === "paid") return "default" as const;
  if (status === "refunded" || status === "failed") return "destructive" as const;
  return "secondary" as const;
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireRole("admin");
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const supabase = await createClient();
  const { data: payments, count } = await supabase
    .from("payments")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const pageCount = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading text-2xl">Payments</h1>
        <p className="text-muted-foreground text-sm">
          {count ?? 0} {count === 1 ? "payment" : "payments"} recorded via Stripe webhooks
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {formatAmount(payment.amount, payment.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(payment.status)} className="capitalize">
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.customer_email ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(payment.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                  No payments yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination basePath="/admin/payments" page={page} pageCount={pageCount} />
    </div>
  );
}
