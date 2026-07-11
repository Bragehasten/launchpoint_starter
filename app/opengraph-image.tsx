import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

/**
 * Default Open Graph image, generated at the edge from site config —
 * rebranding the site rebrands the share cards automatically.
 */

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.02em" }}>
        {siteConfig.name}
      </div>
      <div style={{ fontSize: 30, color: "#a3a3a3", marginTop: 24, maxWidth: 900 }}>
        {siteConfig.description}
      </div>
    </div>,
    size,
  );
}
