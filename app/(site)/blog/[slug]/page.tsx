import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container, Section } from "@/components/shared/container";
import { PostCard } from "@/components/shared/post-card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { readingTimeMinutes, renderContentToHtml } from "@/lib/cms/content";
import { getAuthorProfile, getPublishedPostBySlug, getRelatedPosts } from "@/lib/cms/queries";
import { articleJsonLd, breadcrumbJsonLd, createMetadata, JsonLd } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  return createMetadata({
    title: post.title,
    description: post.excerpt ?? undefined,
    path: `/blog/${post.slug}`,
    image: post.cover_image ?? undefined,
    type: "article",
    publishedTime: post.published_at ?? undefined,
  });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const [author, related] = await Promise.all([
    getAuthorProfile(post.author_id),
    getRelatedPosts(post),
  ]);

  const html = renderContentToHtml(post.content);
  const minutes = readingTimeMinutes(post.content);

  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          url: `${siteConfig.url}/blog/${post.slug}`,
          image: post.cover_image,
          publishedAt: post.published_at,
          modifiedAt: post.updated_at,
          authorName: author?.full_name,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <Section className="pb-8 sm:pb-10 lg:pb-12">
        <Container className="flex max-w-3xl flex-col gap-6">
          {post.categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <Link key={category.id} href={`/blog?category=${category.slug}`}>
                  <Badge variant="secondary">{category.name}</Badge>
                </Link>
              ))}
            </div>
          ) : null}
          <h1 className="heading text-4xl text-balance sm:text-5xl">{post.title}</h1>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            {author?.full_name ? <span>{author.full_name}</span> : null}
            {author?.full_name ? <span aria-hidden="true">·</span> : null}
            {post.published_at ? (
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            ) : null}
            <span aria-hidden="true">·</span>
            <span>{minutes} min read</span>
          </div>
        </Container>
      </Section>

      {post.cover_image ? (
        <Container className="max-w-4xl">
          <div className="bg-muted relative aspect-[2/1] overflow-hidden rounded-xl border">
            <Image
              src={post.cover_image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      ) : null}

      <Section className="pt-10 sm:pt-12">
        <Container className="max-w-3xl">
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            // Content is authored by trusted editors and rendered from
            // structured Tiptap JSON (not raw user HTML).
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section className="border-t">
          <Container className="flex flex-col gap-8">
            <h2 className="heading text-2xl">Keep reading</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </article>
  );
}
