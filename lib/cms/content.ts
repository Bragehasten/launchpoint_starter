import { generateHTML } from "@tiptap/html";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";

import type { Json } from "@/types/json";

/**
 * Tiptap content helpers, shared by the editor (client) and renderer (server).
 * Content is stored as Tiptap JSON — richer and safer than HTML strings.
 */

export const EMPTY_DOC: JSONContent = { type: "doc", content: [] };

/** Extensions used for both editing and rendering. Keep these in sync. */
export function contentExtensions() {
  return [
    StarterKit,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: "noopener noreferrer" },
    }),
  ];
}

/** Server-safe render of stored Tiptap JSON to HTML. */
export function renderContentToHtml(content: Json): string {
  try {
    return generateHTML(content as JSONContent, contentExtensions());
  } catch {
    return "";
  }
}

function extractText(node: JSONContent): string {
  const own = node.text ?? "";
  const children = (node.content ?? []).map(extractText).join(" ");
  return [own, children].filter(Boolean).join(" ");
}

/** Plain text of a Tiptap doc (for excerpts and reading time). */
export function contentToPlainText(content: Json): string {
  try {
    return extractText(content as JSONContent)
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "";
  }
}

const WORDS_PER_MINUTE = 220;

export function readingTimeMinutes(content: Json): number {
  const words = contentToPlainText(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** URL-safe slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}
