import "server-only";

import { BRAND_VOICE_RULES } from "@/lib/ai/context";

/**
 * Prompt presets — one per admin AI task. Each returns { system, prompt,
 * maxTokens }. The business context block is appended by the action so
 * presets stay pure string builders.
 */

export type TaskInput = { topic?: string; extra?: string };

type Preset = {
  label: string;
  description: string;
  /** Placeholder for the main input field in AI Studio. */
  topicPlaceholder: string;
  build: (input: TaskInput) => { system: string; prompt: string; maxTokens: number };
};

const system = (role: string) =>
  `You are ${role} for a local business. ${BRAND_VOICE_RULES}\nRespond with the deliverable only — no preamble, no explanations.`;

export const aiTasks = {
  "service-description": {
    label: "Service description",
    description: "1–2 sentence description for a service on the menu/price list.",
    topicPlaceholder: "Service name, e.g. Hot Towel Shave",
    build: ({ topic, extra }) => ({
      system: system("a copywriter"),
      prompt: `Write a service description (max 2 sentences, max 160 characters) for: ${topic}.${extra ? `\nDetails worth using: ${extra}` : ""}`,
      maxTokens: 200,
    }),
  },
  "seo-title-meta": {
    label: "SEO title + meta description",
    description: "Title tag (≤60 chars) and meta description (≤155 chars) for a page.",
    topicPlaceholder: "Page topic, e.g. the services page",
    build: ({ topic, extra }) => ({
      system: system("an SEO specialist who writes for humans first"),
      prompt: `Write 3 options for the page: ${topic}.${extra ? `\nContext: ${extra}` : ""}\nFormat each option as:\nTitle: … (≤60 characters, include the business or city naturally)\nMeta: … (≤155 characters, one concrete reason to click)`,
      maxTokens: 500,
    }),
  },
  faqs: {
    label: "FAQ set",
    description: "5 questions customers actually ask, with direct answers.",
    topicPlaceholder: "Topic, e.g. booking policies",
    build: ({ topic, extra }) => ({
      system: system("the business owner answering real customer questions"),
      prompt: `Write 5 FAQs about: ${topic}.${extra ? `\nFacts to use: ${extra}` : ""}\nRespond as JSON: [{"question":"…","answer":"…"}] — answers 1–3 sentences, direct, no fluff.`,
      maxTokens: 900,
    }),
  },
  "blog-draft": {
    label: "Blog post draft",
    description: "A full draft in Markdown — outline, intro, sections, CTA.",
    topicPlaceholder: "Post topic, e.g. how often should you get a haircut",
    build: ({ topic, extra }) => ({
      system: system("a content writer who knows the trade deeply"),
      prompt: `Write a blog post draft (600–900 words, Markdown, ## section headings) about: ${topic}.${extra ? `\nAngle/notes: ${extra}` : ""}\nEnd with a one-line call to action. Mark any spot needing a business-specific fact with [FILL IN].`,
      maxTokens: 2000,
    }),
  },
  rewrite: {
    label: "Rewrite copy",
    description: "Rewrites text in the brand voice; tighter and clearer.",
    topicPlaceholder: "Paste the text to rewrite",
    build: ({ topic, extra }) => ({
      system: system("an editor"),
      prompt: `Rewrite this text${extra ? ` (${extra})` : ""} — keep the meaning, cut the filler, match the voice rules:\n\n${topic}`,
      maxTokens: 1200,
    }),
  },
  "testimonial-summary": {
    label: "Testimonial summary",
    description: "Distills pasted reviews into a short 'what customers say' blurb.",
    topicPlaceholder: "Paste several reviews",
    build: ({ topic }) => ({
      system: system("a marketer summarizing social proof honestly"),
      prompt: `Summarize what these customers consistently praise, in 2–3 sentences usable on the website. Only claim what the reviews actually support:\n\n${topic}`,
      maxTokens: 400,
    }),
  },
  "social-post": {
    label: "Social media posts",
    description: "3 post variants (Instagram/Facebook) for a promo or update.",
    topicPlaceholder: "What to promote, e.g. Tuesday senior special",
    build: ({ topic, extra }) => ({
      system: system("a social media manager for a local business"),
      prompt: `Write 3 short social post variants about: ${topic}.${extra ? `\nDetails: ${extra}` : ""}\nOne playful, one straightforward, one urgency-driven. ≤60 words each, at most 2 hashtags each, no emoji spam (2 max per post).`,
      maxTokens: 700,
    }),
  },
  "service-area-copy": {
    label: "Service-area page copy",
    description: "Unique intro, body, and FAQs for a city page — the doorway-page killer.",
    topicPlaceholder: "Area, e.g. Jupiter, FL",
    build: ({ topic, extra }) => ({
      system: system("a local-SEO copywriter who refuses to write doorway pages"),
      prompt: `Write landing-page copy for our service area: ${topic}.
${extra ? `What's true about our work there (USE these, invent nothing else): ${extra}` : "No area-specific facts were provided, so keep claims generic-but-honest (response times, process, guarantees) rather than inventing local details."}
Respond as JSON:
{"intro": "1–2 sentences, specific to this area, ≤220 chars",
 "body": "2 short paragraphs separated by a blank line",
 "faqs": [{"question":"…","answer":"…"}, …exactly 3]}
The intro must NOT be reusable for another city by swapping the name — tie it to something real (the provided facts, housing stock, drive times).`,
      maxTokens: 1200,
    }),
  },
} satisfies Record<string, Preset>;

export type AiTaskKey = keyof typeof aiTasks;

export const aiTaskKeys = Object.keys(aiTasks) as AiTaskKey[];
