import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostEditor } from "@/components/admin/post-editor";
import { getCategories } from "@/lib/cms/queries";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("editor");
  const { id } = await params;

  const supabase = await createClient();
  const [{ data: post }, categories, { data: links }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).single(),
    getCategories(),
    supabase.from("post_categories").select("category_id").eq("post_id", id),
  ]);

  if (!post) notFound();

  return (
    <PostEditor
      post={post}
      categories={categories}
      selectedCategoryIds={(links ?? []).map((l) => l.category_id)}
    />
  );
}
