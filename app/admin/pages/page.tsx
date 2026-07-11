import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { setPageStatus } from "@/actions/cms";
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

export const metadata: Metadata = { title: "Pages" };

export default async function AdminPagesPage() {
  await requireRole("editor");

  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("cms_pages")
    .select("id, title, slug, status, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="heading text-2xl">Pages</h1>
          <p className="text-muted-foreground text-sm">
            Section-built pages, served at{" "}
            <code className="font-mono text-xs">/p/&lt;slug&gt;</code>
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus />
            New page
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-28">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages && pages.length > 0 ? (
              pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <Link href={`/admin/pages/${page.id}`} className="font-medium hover:underline">
                      {page.title}
                    </Link>
                    <p className="text-muted-foreground text-xs">/p/{page.slug}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={page.status === "published" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(page.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <form action={setPageStatus}>
                      <input type="hidden" name="id" value={page.id} />
                      <input
                        type="hidden"
                        name="publish"
                        value={page.status === "published" ? "false" : "true"}
                      />
                      <Button type="submit" variant="outline" size="sm">
                        {page.status === "published" ? "Unpublish" : "Publish"}
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground h-24 text-center">
                  No pages yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
