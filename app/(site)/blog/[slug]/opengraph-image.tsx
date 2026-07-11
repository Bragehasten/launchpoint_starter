import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { getPublishedPostBySlug } from "@/lib/cms/queries";

/** Per-post OG image: post title on the brand card. */

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  const title = post?.title ?? siteConfig.name;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 28, color: "#a3a3a3" }}>{siteConfig.name} — Blog</div>
      <div
        style={{
          fontSize: title.length > 60 ? 52 : 64,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 24, color: "#a3a3a3" }}>
        {siteConfig.url.replace(/^https?:\/\//, "")}
      </div>
    </div>,
    size,
  );
}
