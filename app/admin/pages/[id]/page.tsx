import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageEditor } from "@/components/admin/page-editor";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Edit page" };

export default async function EditCmsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("editor");
  const { id } = await params;

  const supabase = await createClient();
  const { data: page } = await supabase.from("cms_pages").select("*").eq("id", id).single();
  if (!page) notFound();

  return <PageEditor page={page} />;
}
