"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { savePage } from "@/actions/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sectionTypes } from "@/lib/sections/schemas";
import type { CmsPage } from "@/types/database";

const STARTER_BLOCKS = JSON.stringify(
  [
    {
      type: "hero",
      title: "Page title",
      description: "A short compelling description.",
      actions: [{ label: "Get started", href: "/contact" }],
    },
    {
      type: "cta",
      title: "Ready to talk?",
      actions: [{ label: "Contact us", href: "/contact" }],
    },
  ],
  null,
  2,
);

/**
 * Page editor v1: metadata fields + section blocks as validated JSON.
 * Blocks are checked against the section registry schemas on save — invalid
 * content cannot reach a live page. A visual builder is on the backlog (M8).
 */
export function PageEditor({ page }: { page: CmsPage | null }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const [pageId, setPageId] = React.useState<string | null>(page?.id ?? null);
  const [title, setTitle] = React.useState(page?.title ?? "");
  const [slug, setSlug] = React.useState(page?.slug ?? "");
  const [description, setDescription] = React.useState(page?.description ?? "");
  const [blocks, setBlocks] = React.useState(
    page ? JSON.stringify(page.blocks, null, 2) : STARTER_BLOCKS,
  );
  const [blockErrors, setBlockErrors] = React.useState<string[]>([]);

  function handleSave() {
    startTransition(async () => {
      const result = await savePage(pageId, { title, slug, description, blocks });
      setBlockErrors(result.blockErrors ?? []);
      if (!result.success) {
        toast.error(result.message ?? "Could not save.");
        return;
      }
      toast.success("Saved.");
      if (!pageId && result.id) {
        setPageId(result.id);
        router.replace(`/admin/pages/${result.id}`);
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="heading text-2xl">{pageId ? "Edit page" : "New page"}</h1>
        <div className="flex items-center gap-2">
          {pageId && page?.status === "published" ? (
            <Button asChild variant="outline">
              <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink />
                View live
              </a>
            </Button>
          ) : null}
          <Button onClick={handleSave} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : null}
            Save
          </Button>
        </div>
      </div>

      <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="page-title">Title</Label>
          <Input id="page-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="page-slug">Slug</Label>
          <Input
            id="page-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="about-us"
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="page-description">Meta description</Label>
          <Textarea
            id="page-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="page-blocks">Section blocks</Label>
        <p className="text-muted-foreground text-sm">
          An ordered array of sections. Available types: {sectionTypes.join(", ")}. Blocks are
          validated on save.
        </p>
        <Textarea
          id="page-blocks"
          value={blocks}
          onChange={(e) => setBlocks(e.target.value)}
          rows={20}
          className="font-mono text-sm"
          spellCheck={false}
        />
        {blockErrors.length > 0 ? (
          <ul
            role="alert"
            className="bg-destructive/10 text-destructive list-inside list-disc rounded-md px-3 py-2 text-sm"
          >
            {blockErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
