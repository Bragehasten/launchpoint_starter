import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

import { createCategory, deleteCategory } from "@/actions/cms";
import { DataTablePagination } from "@/components/shared/pagination";
import { DataTableToolbar } from "@/components/admin/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategories } from "@/lib/cms/queries";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ContentStatus } from "@/types/database";

export const metadata: Metadata = { title: "Posts" };

const PAGE_SIZE = 10;

function statusVariant(status: ContentStatus) {
  return status === "published" ? "default" : status === "draft" ? "secondary" : "outline";
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireRole("editor");
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("id, title, slug, status, published_at, updated_at", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (q) query = query.ilike("title", `%${q}%`);

  const [{ data: posts, count }, categories] = await Promise.all([query, getCategories()]);
  const pageCount = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="heading text-2xl">Posts</h1>
          <p className="text-muted-foreground text-sm">
            {count ?? 0} {count === 1 ? "post" : "posts"}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus />
            New post
          </Link>
        </Button>
      </div>

      <DataTableToolbar action="/admin/posts" placeholder="Search posts…" defaultValue={q} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link href={`/admin/posts/${post.id}`} className="font-medium hover:underline">
                      {post.title}
                    </Link>
                    <p className="text-muted-foreground text-xs">/blog/{post.slug}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(post.status)} className="capitalize">
                      {post.status === "published" &&
                      post.published_at &&
                      new Date(post.published_at) > new Date()
                        ? "scheduled"
                        : post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(post.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground h-24 text-center">
                  {q ? `No posts matching "${q}".` : "No posts yet — write your first one."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        basePath="/admin/posts"
        page={page}
        pageCount={pageCount}
        searchParams={{ q }}
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Group posts for filtering on the blog</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form action={createCategory} className="flex gap-2">
            <Input name="name" placeholder="New category name" aria-label="New category name" />
            <Button type="submit" variant="outline">
              Add
            </Button>
          </form>
          {categories.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <form action={deleteCategory} className="inline">
                    <input type="hidden" name="id" value={category.id} />
                    <Badge variant="secondary" className="gap-1.5">
                      {category.name}
                      <button
                        type="submit"
                        aria-label={`Delete category ${category.name}`}
                        className="hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </Badge>
                  </form>
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
