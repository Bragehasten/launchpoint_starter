import type { Metadata } from "next";

import { RoleMenu } from "@/app/admin/users/role-menu";
import { DataTablePagination } from "@/components/shared/pagination";
import { DataTableToolbar } from "@/components/admin/data-table-toolbar";
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

export const metadata: Metadata = { title: "Users" };

const PAGE_SIZE = 10;

type SearchParams = Promise<{ q?: string; page?: string }>;

export default async function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  const viewer = await requireRole("admin");
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (q) {
    query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`);
  }

  const { data: users, count } = await query;
  const pageCount = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading text-2xl">Users</h1>
        <p className="text-muted-foreground text-sm">
          {count ?? 0} registered {count === 1 ? "user" : "users"}
        </p>
      </div>

      <DataTableToolbar
        action="/admin/users"
        placeholder="Search by name or email…"
        defaultValue={q}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <RoleMenu
                      userId={user.id}
                      currentRole={user.role}
                      isSelf={user.id === viewer.id}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                  {q ? `No users matching "${q}".` : "No users yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        basePath="/admin/users"
        page={page}
        pageCount={pageCount}
        searchParams={{ q }}
      />
    </div>
  );
}
