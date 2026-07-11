import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

/**
 * Fonts are self-hosted via the `geist` package: zero network requests at
 * build or runtime, zero layout shift. To rebrand typography, swap these for
 * another self-hosted font (e.g. via next/font/local or another package) and
 * keep the exported names — the rest of the app only knows `fontSans`/`fontMono`.
 */

export const fontSans = GeistSans;
export const fontMono = GeistMono;
