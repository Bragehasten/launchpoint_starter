/**
 * Cookie consent state, shared by the banner and anything that needs
 * gating (analytics scripts in M13, marketing pixels per client).
 *
 * Stored in localStorage — consent is a client-side concern; the server
 * never needs it. "necessary" is always true and not user-toggleable.
 */

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  /** ISO timestamp of the choice, for re-prompting after policy changes. */
  decidedAt: string;
};

const STORAGE_KEY = "lp-cookie-consent";

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    return typeof parsed.analytics === "boolean" ? parsed : null;
  } catch {
    return null;
  }
}

export function setConsent(analytics: boolean): ConsentState {
  const state: ConsentState = {
    necessary: true,
    analytics,
    decidedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Let listeners (analytics loader) react without a reload.
  window.dispatchEvent(new CustomEvent("lp:consent", { detail: state }));
  return state;
}
