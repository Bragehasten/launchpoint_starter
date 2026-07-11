import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck, MailOpen, Paperclip, Trash2 } from "lucide-react";

import { deleteSubmission, toggleSubmissionRead } from "@/actions/inbox";
import { DataTablePagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import type { Json } from "@/types/json";

export const metadata: Metadata = { title: "Inbox" };

const PAGE_SIZE = 10;

function dataField(data: Json, key: string): string | null {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const value = data[key];
    return typeof value === "string" ? value : null;
  }
  return null;
}

/** All non-empty string entries of a submission payload, in insertion order. */
function dataEntries(data: Json): { key: string; value: string }[] {
  if (!data || typeof data !== "object" || Array.isArray(data)) return [];
  return Object.entries(data)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1] !== "")
    .map(([key, value]) => ({ key, value }));
}

function humanize(key: string): string {
  return key.replace(/_attachment$/, "").replaceAll("_", " ");
}

export default async function AdminInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; page?: string }>;
}) {
  await requireRole("editor");
  const { kind, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const supabase = await createClient();

  let query = supabase
    .from("form_submissions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (kind) query = query.eq("kind", kind);

  const [{ data: submissions, count }, { count: subscriberCount }, kinds] = await Promise.all([
    query,
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .is("unsubscribed_at", null),
    supabase.from("form_submissions").select("kind").limit(500),
  ]);

  const pageCount = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const availableKinds = [...new Set((kinds.data ?? []).map((k) => k.kind))];

  // Pre-resolve short-lived signed URLs for attachment fields (private
  // bucket — editors only, links expire in an hour).
  const prepared = await Promise.all(
    (submissions ?? []).map(async (submission) => {
      const entries = await Promise.all(
        dataEntries(submission.data).map(async ({ key, value }) => {
          if (!key.endsWith("_attachment")) return { key, value, href: null };
          const { data: signed } = await supabase.storage
            .from("form-attachments")
            .createSignedUrl(value, 3600);
          return { key, value: value.split("/").pop() ?? value, href: signed?.signedUrl ?? null };
        }),
      );
      return { submission, entries };
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading text-2xl">Inbox</h1>
        <p className="text-muted-foreground text-sm">
          {count ?? 0} {count === 1 ? "submission" : "submissions"} · {subscriberCount ?? 0}{" "}
          newsletter {subscriberCount === 1 ? "subscriber" : "subscribers"}
        </p>
      </div>

      {availableKinds.length > 1 ? (
        <nav aria-label="Filter by kind">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/admin/inbox">
                <Badge variant={!kind ? "default" : "secondary"}>All</Badge>
              </Link>
            </li>
            {availableKinds.map((k) => (
              <li key={k}>
                <Link href={`/admin/inbox?kind=${k}`}>
                  <Badge variant={kind === k ? "default" : "secondary"} className="capitalize">
                    {k}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {prepared.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {prepared.map(({ submission, entries }) => {
            const name = dataField(submission.data, "name");
            return (
              <li key={submission.id}>
                <Card className={cn(!submission.read && "border-primary/40")}>
                  <CardContent className="flex flex-col gap-3 pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        {!submission.read ? (
                          <span className="bg-primary size-2 rounded-full" aria-label="Unread" />
                        ) : null}
                        <span className="font-medium">{name ?? submission.email}</span>
                        <a
                          href={`mailto:${submission.email}`}
                          className="text-muted-foreground hover:underline"
                        >
                          {submission.email}
                        </a>
                        <Badge variant="secondary" className="capitalize">
                          {submission.kind}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <time
                          dateTime={submission.created_at}
                          className="text-muted-foreground mr-2 text-xs"
                        >
                          {new Date(submission.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </time>
                        <form action={toggleSubmissionRead}>
                          <input type="hidden" name="id" value={submission.id} />
                          <input type="hidden" name="read" value={String(!submission.read)} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            aria-label={submission.read ? "Mark unread" : "Mark read"}
                          >
                            {submission.read ? (
                              <MailCheck className="size-4" />
                            ) : (
                              <MailOpen className="size-4" />
                            )}
                          </Button>
                        </form>
                        <form action={deleteSubmission}>
                          <input type="hidden" name="id" value={submission.id} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            aria-label="Delete submission"
                            className="hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                    {entries.length > 0 ? (
                      <dl className="flex flex-col gap-2">
                        {entries.map(({ key, value, href }) => (
                          <div key={key}>
                            <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                              {humanize(key)}
                            </dt>
                            <dd className="text-sm leading-relaxed whitespace-pre-wrap">
                              {href ? (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary inline-flex items-center gap-1.5 hover:underline"
                                >
                                  <Paperclip className="size-3.5" aria-hidden="true" />
                                  {value}
                                </a>
                              ) : (
                                value
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted-foreground rounded-md border border-dashed p-12 text-center text-sm">
          {kind ? `No ${kind} submissions.` : "No submissions yet."}
        </p>
      )}

      <DataTablePagination
        basePath="/admin/inbox"
        page={page}
        pageCount={pageCount}
        searchParams={{ kind }}
      />
    </div>
  );
}
