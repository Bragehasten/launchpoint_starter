import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { PostWithCategories } from "@/lib/cms/queries";

export function PostCard({ post }: { post: PostWithCategories }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden pt-0">
      <Link
        href={`/blog/${post.slug}`}
        className="bg-muted relative block aspect-[16/9]"
        tabIndex={-1}
        aria-hidden="true"
      >
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </Link>
      <CardHeader className="pb-0">
        {post.categories.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {post.categories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
        ) : null}
        <h2 className="text-lg leading-snug font-semibold tracking-tight">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-3">
        {post.excerpt ? (
          <p className="text-muted-foreground line-clamp-3 text-sm">{post.excerpt}</p>
        ) : null}
        {post.published_at ? (
          <time dateTime={post.published_at} className="text-muted-foreground text-xs">
            {new Date(post.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        ) : null}
      </CardContent>
    </Card>
  );
}
