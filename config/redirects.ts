/**
 * 301 redirects, managed in config. Useful when a client migrates from an
 * old site: map their legacy URLs here to preserve link equity.
 * Read by next.config.ts at build time.
 */

export type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export const redirects: Redirect[] = [
  // Example:
  // { source: "/old-menu", destination: "/menu", permanent: true },
];
