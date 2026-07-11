import type { Metadata } from "next";

import { PostEditor } from "@/components/admin/post-editor";
import { getCategories } from "@/lib/cms/queries";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  await requireRole("editor");
  const categories = await getCategories();

  return <PostEditor post={null} categories={categories} selectedCategoryIds={[]} />;
}
