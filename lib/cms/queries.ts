import { createClient } from "@/lib/supabase/server";
import type { Category, Post } from "@/types/database";

/**
 * Public CMS read layer. RLS already restricts anonymous readers to
 * published content with published_at <= now(), which is also how scheduled
 * posts go live without a cron job. The explicit filters here keep editor
 * sessions (who can see drafts) from leaking them into public pages.
 */

export const POSTS_PAGE_SIZE = 9;

export type PostWithCategories = Post & { categories: Category[] };

type PostRowWithJoin = Post & { post_categories: { categories: Category | null }[] };

function flattenCategories(row: PostRowWithJoin): PostWithCategories {
  const { post_categories, ...post } = row;
  return {
    ...post,
    categories: post_categories.map((pc) => pc.categories).filter((c): c is Category => c !== null),
  };
}

const POST_WITH_CATEGORIES = "*, post_categories(categories(*))";

export async function getPublishedPosts(options: { page?: number; categorySlug?: string } = {}) {
  const { page = 1, categorySlug } = options;
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select(POST_WITH_CATEGORIES, { count: "exact" })
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (!category) return { posts: [], count: 0 };
    const { data: links } = await supabase
      .from("post_categories")
      .select("post_id")
      .eq("category_id", category.id);
    const ids = (links ?? []).map((l) => l.post_id);
    if (ids.length === 0) return { posts: [], count: 0 };
    query = query.in("id", ids);
  }

  const from = (page - 1) * POSTS_PAGE_SIZE;
  const { data, count } = await query.range(from, from + POSTS_PAGE_SIZE - 1);

  return {
    posts: ((data ?? []) as PostRowWithJoin[]).map(flattenCategories),
    count: count ?? 0,
  };
}

export async function getPublishedPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(POST_WITH_CATEGORIES)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .single();

  return data ? flattenCategories(data as PostRowWithJoin) : null;
}

/** Author display info, fetched separately to keep RLS simple. */
export async function getAuthorProfile(authorId: string | null) {
  if (!authorId) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", authorId)
    .single();
  return data;
}

export async function getRelatedPosts(post: PostWithCategories, limit = 3) {
  const categoryIds = post.categories.map((c) => c.id);
  const supabase = await createClient();

  if (categoryIds.length > 0) {
    const { data: links } = await supabase
      .from("post_categories")
      .select("post_id")
      .in("category_id", categoryIds)
      .neq("post_id", post.id)
      .limit(24);
    const ids = [...new Set((links ?? []).map((l) => l.post_id))];
    if (ids.length > 0) {
      const { data } = await supabase
        .from("posts")
        .select(POST_WITH_CATEGORIES)
        .in("id", ids)
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(limit);
      if (data && data.length > 0) {
        return (data as PostRowWithJoin[]).map(flattenCategories);
      }
    }
  }

  // Fallback: latest posts.
  const { data } = await supabase
    .from("posts")
    .select(POST_WITH_CATEGORIES)
    .neq("id", post.id)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  return ((data ?? []) as PostRowWithJoin[]).map(flattenCategories);
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data ?? [];
}

export async function getPublishedPageBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .single();
  return data;
}
