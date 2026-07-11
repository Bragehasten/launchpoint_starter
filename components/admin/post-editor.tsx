"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { CalendarClock, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { publishPost, savePost, unpublishPost, uploadMedia } from "@/actions/cms";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_DOC } from "@/lib/cms/content";
import type { Category, Post } from "@/types/database";

type PostEditorProps = {
  post: Post | null;
  categories: Category[];
  selectedCategoryIds: string[];
};

export function PostEditor({ post, categories, selectedCategoryIds }: PostEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const [postId, setPostId] = React.useState<string | null>(post?.id ?? null);
  const [title, setTitle] = React.useState(post?.title ?? "");
  const [slug, setSlug] = React.useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = React.useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = React.useState(post?.cover_image ?? "");
  const [categoryIds, setCategoryIds] = React.useState<string[]>(selectedCategoryIds);
  const [scheduleAt, setScheduleAt] = React.useState("");
  const contentRef = React.useRef<JSONContent>((post?.content as JSONContent) ?? EMPTY_DOC);

  const isPublished = post?.status === "published";

  function collectInput() {
    return {
      title,
      slug: slug || undefined,
      excerpt: excerpt || undefined,
      coverImage: coverImage || undefined,
      content: JSON.stringify(contentRef.current),
      categoryIds,
    };
  }

  function handleSave() {
    startTransition(async () => {
      const result = await savePost(postId, collectInput());
      if (!result.success) {
        toast.error(result.message ?? "Could not save.");
        return;
      }
      toast.success("Saved.");
      if (!postId && result.id) {
        setPostId(result.id);
        router.replace(`/admin/posts/${result.id}`);
      }
      router.refresh();
    });
  }

  function handlePublish(publishedAt?: string) {
    startTransition(async () => {
      // Save first so the published version is the one on screen.
      const saved = await savePost(postId, collectInput());
      if (!saved.success || !saved.id) {
        toast.error(saved.message ?? "Could not save.");
        return;
      }
      const result = await publishPost({ id: saved.id, publishedAt });
      if (!result.success) {
        toast.error(result.message ?? "Could not publish.");
        return;
      }
      toast.success(
        publishedAt && new Date(publishedAt) > new Date() ? "Scheduled." : "Published.",
      );
      if (!postId) setPostId(saved.id);
      router.refresh();
    });
  }

  function handleUnpublish() {
    if (!postId) return;
    startTransition(async () => {
      const result = await unpublishPost(postId);
      if (result.success) {
        toast.success("Reverted to draft.");
        router.refresh();
      } else {
        toast.error(result.message ?? "Could not unpublish.");
      }
    });
  }

  async function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadMedia(formData);
    if (result.success && result.url) {
      setCoverImage(result.url);
      toast.success("Cover image uploaded.");
    } else {
      toast.error(result.message ?? "Upload failed.");
    }
    event.target.value = "";
  }

  function toggleCategory(id: string) {
    setCategoryIds((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id],
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="heading text-2xl">{postId ? "Edit post" : "New post"}</h1>
          {post ? (
            <Badge variant={isPublished ? "default" : "secondary"} className="capitalize">
              {post.status}
              {isPublished && post.published_at && new Date(post.published_at) > new Date()
                ? " (scheduled)"
                : ""}
            </Badge>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {isPublished ? (
            <Button variant="outline" onClick={handleUnpublish} disabled={pending}>
              Unpublish
            </Button>
          ) : null}
          <Button variant="outline" onClick={handleSave} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : null}
            Save draft
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={pending} aria-label="Schedule">
                <CalendarClock />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Schedule publish</DialogTitle>
                <DialogDescription>
                  The post goes live automatically at this time.
                </DialogDescription>
              </DialogHeader>
              <Input
                type="datetime-local"
                value={scheduleAt}
                onChange={(e) => setScheduleAt(e.target.value)}
                aria-label="Publish date and time"
              />
              <DialogFooter>
                <Button
                  onClick={() => scheduleAt && handlePublish(new Date(scheduleAt).toISOString())}
                  disabled={!scheduleAt || pending}
                >
                  Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={() => handlePublish()} disabled={pending}>
            {isPublished ? "Update" : "Publish now"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Content</Label>
            <RichTextEditor
              initialContent={contentRef.current}
              onChange={(json) => {
                contentRef.current = json;
              }}
            />
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-slug">Slug</Label>
            <Input
              id="post-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated from title"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-excerpt">Excerpt</Label>
            <Textarea
              id="post-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary for cards and SEO"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-cover">Cover image URL</Label>
            <Input
              id="post-cover"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://…"
            />
            <label className="text-muted-foreground hover:text-foreground inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm transition-colors">
              <Upload className="size-3.5" />
              Upload image
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleCoverUpload}
              />
            </label>
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm leading-none font-medium">Categories</legend>
            {categories.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No categories yet — create them from the Posts page.
              </p>
            ) : (
              <div className="mt-2 flex flex-col gap-1.5">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={categoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="accent-primary size-4"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        </aside>
      </div>
    </div>
  );
}
