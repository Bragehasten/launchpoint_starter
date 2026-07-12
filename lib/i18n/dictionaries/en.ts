/**
 * English UI strings — the reference dictionary. `es.ts` must satisfy this
 * exact shape, so a missing Spanish key is a COMPILE error, not a silent
 * English leak. These are FRAMEWORK strings (buttons, labels, boilerplate);
 * client content is translated via the translations table (docs/i18n.md).
 *
 * Plain strings only (serializable across the server→client boundary).
 * {placeholders} are filled by `interpolate()` from lib/i18n.
 */

export const en = {
  common: {
    skipToContent: "Skip to content",
    backToHome: "Back to home",
    loading: "Loading page",
    selectPlaceholder: "Select…",
    pageNotFound: "Page not found",
    pageNotFoundBody: "The page you're looking for doesn't exist or may have moved.",
    errorTitle: "Something went wrong",
    tryAgain: "Try again",
    switchLanguage: "En español",
    switchLanguageHref: "/es",
  },
  footer: {
    newsletterTitle: "Subscribe to our newsletter",
    newsletterButton: "Subscribe",
    allRightsReserved: "All rights reserved.",
    allLocations: "All {count} locations",
  },
  booking: {
    minuteAppointments: "{minutes}-minute appointments. Pick a day and time.",
    previous: "Previous",
    next: "Next",
    closedThisDay: "Closed this day — try another date.",
    selectTime: "Select a time above to continue.",
    requested: "Booking requested — we'll confirm by email shortly.",
    confirm: "Confirm booking",
    name: "Name",
    email: "Email",
    phoneOptional: "Phone (optional)",
    notesOptional: "Notes (optional)",
  },
  locations: {
    allLocations: "All locations",
    mainLocation: "Main location",
    teamHere: "The team here",
    customersSay: "What customers say",
    contactLocation: "Contact {name}",
    contactLocationBody: "Questions about this location? Send a message.",
  },
  serviceAreas: {
    allAreas: "All service areas",
    whatWeDo: "What we do in {area}",
    questions: "{area} questions",
    freeQuote: "Get a free quote in {area}",
    freeQuoteBody: "Tell us about the job — we respond within one business day.",
    alsoServing: "Also serving",
    inArea: "{noun} in {area}",
  },
} as const;

/** Shape contract for every other locale. */
export type Dictionary = {
  readonly [Section in keyof typeof en]: { readonly [Key in keyof (typeof en)[Section]]: string };
};
