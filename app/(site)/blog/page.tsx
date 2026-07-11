import type { Metadata } from "next";
import Link from "next/link";

import { DataTablePagination } from "@/components/shared/pagination";
import { Container, Section } from "@/components/shared/container";
import { PostCard } from "@/components/shared/post-card";
import { Badge } from "@/components/ui/badge";
import { getCategories, getPublishedPosts, POSTS_PAGE_SIZE } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description: "News, guides, and updates.",
  path: "/blog",
});

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page: pageParam, category } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ posts, count }, categories] = await Promise.all([
    getPublishedPosts({ page, categorySlug: category }),
    getCategories(),
  ]);
  const pageCount = Math.max(1, Math.ceil(count / POSTS_PAGE_SIZE));

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h1 className="heading text-4xl">Blog</h1>
          <p className="text-muted-foreground text-lg">News, guides, and updates.</p>
        </div>

        {categories.length > 0 ? (
          <nav aria-label="Categories">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link href="/blog">
                  <Badge variant={!category ? "default" : "secondary"}>All</Badge>
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/blog?category=${cat.slug}`}>
                    <Badge variant={category === cat.slug ? "default" : "secondary"}>
                      {cat.name}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {posts.length > 0 ? (
          <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3")}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground rounded-md border border-dashed p-16 text-center">
            No posts published yet — check back soon.
          </p>
        )}

        <DataTablePagination
          basePath="/blog"
          page={page}
          pageCount={pageCount}
          searchParams={{ category }}
        />
      </Container>
    </Section>
  );
}
