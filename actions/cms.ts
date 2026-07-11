"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { slugify } from "@/lib/cms/content";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { validateBlocks } from "@/lib/sections/schemas";
import type { Json } from "@/types/json";

/**
 * CMS server actions. Guarded by requireRole("editor") for UX; RLS enforces
 * the same rule in the database. Every mutation revalidates the public routes
 * it affects so ISR pages update without a redeploy.
 */

export type CmsActionResult = { success: boolean; message?: string; id?: string };

const postInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().max(120).optional(),
  excerpt: z.string().max(500).optional(),
  coverImage: z.union([z.url(), z.literal("")]).optional(),
  content: z.string(),
  categoryIds: z.array(z.uuid()).optional(),
});

function parseContent(raw: string): Json {
  try {
    return JSON.parse(raw) as Json;
  } catch {
    return { type: "doc", content: [] };
  }
}

function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function savePost(
  postId: string | null,
  input: z.infer<typeof postInputSchema>,
): Promise<CmsActionResult> {
  const editor = await requireRole("editor");

  const parsed = postInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const data = parsed.data;
  const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);

  const row = {
    title: data.title,
    slug,
    excerpt: data.excerpt || null,
    cover_image: data.coverImage || null,
    content: parseContent(data.content),
  };

  let id = postId;

  if (id) {
    const { error } = await supabase.from("posts").update(row).eq("id", id);
    if (error) return { success: false, message: friendly(error.message) };
  } else {
    const { data: created, error } = await supabase
      .from("posts")
      .insert({ ...row, author_id: editor.id })
      .select("id")
      .single();
    if (error || !created) return { success: false, message: friendly(error?.message) };
    id = created.id;
  }

  // Replace category links.
  await supabase.from("post_categories").delete().eq("post_id", id);
  if (data.categoryIds && data.categoryIds.length > 0) {
    await supabase
      .from("post_categories")
      .insert(data.categoryIds.map((categoryId) => ({ post_id: id, category_id: categoryId })));
  }

  revalidateBlog(slug);
  revalidatePath("/admin/posts");
  return { success: true, id };
}

const publishSchema = z.object({
  id: z.uuid(),
  /** ISO timestamp; future = scheduled. Empty = now. */
  publishedAt: z.string().optional(),
});

export async function publishPost(input: z.infer<typeof publishSchema>): Promise<CmsActionResult> {
  await requireRole("editor");
  const parsed = publishSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid input" };

  const publishedAt = parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : new Date();
  if (Number.isNaN(publishedAt.getTime())) {
    return { success: false, message: "Invalid publish date" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .update({ status: "published", published_at: publishedAt.toISOString() })
    .eq("id", parsed.data.id)
    .select("slug")
    .single();

  if (error || !data) return { success: false, message: friendly(error?.message) };

  revalidateBlog(data.slug);
  revalidatePath("/admin/posts");
  return { success: true };
}

export async function unpublishPost(id: string): Promise<CmsActionResult> {
  await requireRole("editor");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .update({ status: "draft", published_at: null })
    .eq("id", id)
    .select("slug")
    .single();
  if (error || !data) return { success: false, message: friendly(error?.message) };

  revalidateBlog(data.slug);
  revalidatePath("/admin/posts");
  return { success: true };
}

export async function deletePost(id: string): Promise<void> {
  await requireRole("editor");
  const supabase = await createClient();
  const { data } = await supabase.from("posts").delete().eq("id", id).select("slug").single();
  revalidateBlog(data?.slug);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

// Categories -----------------------------------------------------------

const categorySchema = z.object({ name: z.string().min(1).max(60) });

export async function createCategory(formData: FormData): Promise<void> {
  await requireRole("editor");
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClient();
  await supabase
    .from("categories")
    .insert({ name: parsed.data.name, slug: slugify(parsed.data.name) });
  revalidatePath("/admin/posts");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireRole("editor");
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}

// Media ----------------------------------------------------------------

export async function uploadMedia(formData: FormData): Promise<CmsActionResult & { url?: string }> {
  const editor = await requireRole("editor");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "Choose a file to upload." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { success: false, message: "Max file size is 8 MB." };
  }
  if (!file.type.startsWith("image/")) {
    return { success: false, message: "Only images are supported." };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file, { contentType: file.type });
  if (uploadError) return { success: false, message: friendly(uploadError.message) };

  await supabase.from("media").insert({
    path,
    alt: (formData.get("alt") as string) || null,
    created_by: editor.id,
  });

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  revalidatePath("/admin/media");
  return { success: true, url: publicUrl };
}

export async function deleteMedia(formData: FormData): Promise<void> {
  await requireRole("editor");
  const path = formData.get("path");
  if (typeof path !== "string") return;

  const supabase = await createClient();
  await supabase.storage.from("media").remove([path]);
  await supabase.from("media").delete().eq("path", path);
  revalidatePath("/admin/media");
}

// Pages ----------------------------------------------------------------

const pageInputSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(120),
  description: z.string().max(300).optional(),
  /** JSON string of section blocks. */
  blocks: z.string(),
});

export async function savePage(
  pageId: string | null,
  input: z.infer<typeof pageInputSchema>,
): Promise<CmsActionResult & { blockErrors?: string[] }> {
  await requireRole("editor");

  const parsed = pageInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  let blocks: unknown;
  try {
    blocks = JSON.parse(parsed.data.blocks);
  } catch {
    return { success: false, message: "Blocks are not valid JSON." };
  }

  const { errors } = validateBlocks(blocks);
  if (errors.length > 0) {
    return {
      success: false,
      message: "Some blocks failed validation.",
      blockErrors: errors.map((e) => `Block ${e.index + 1}: ${e.message}`),
    };
  }

  const supabase = await createClient();
  const slug = slugify(parsed.data.slug);
  const row = {
    title: parsed.data.title,
    slug,
    description: parsed.data.description || null,
    blocks: blocks as Json,
  };

  let id = pageId;
  if (id) {
    const { error } = await supabase.from("cms_pages").update(row).eq("id", id);
    if (error) return { success: false, message: friendly(error.message) };
  } else {
    const { data: created, error } = await supabase
      .from("cms_pages")
      .insert(row)
      .select("id")
      .single();
    if (error || !created) return { success: false, message: friendly(error?.message) };
    id = created.id;
  }

  revalidatePath(`/p/${slug}`);
  revalidatePath("/admin/pages");
  return { success: true, id };
}

export async function setPageStatus(formData: FormData): Promise<void> {
  await requireRole("editor");
  const id = formData.get("id");
  const publish = formData.get("publish") === "true";
  if (typeof id !== "string") return;

  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_pages")
    .update(
      publish
        ? { status: "published", published_at: new Date().toISOString() }
        : { status: "draft", published_at: null },
    )
    .eq("id", id)
    .select("slug")
    .single();

  if (data) revalidatePath(`/p/${data.slug}`);
  revalidatePath("/admin/pages");
}

function friendly(message?: string): string {
  if (!message) return "Something went wrong. Please try again.";
  if (message.includes("duplicate key")) return "That slug is already in use.";
  return message;
}
