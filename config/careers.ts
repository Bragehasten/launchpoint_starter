/**
 * Job openings, managed in config. For clients who hire frequently this
 * becomes a CMS collection; for most, editing this file is simpler.
 */

export type JobOpening = {
  title: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  description: string;
};

export const openings: JobOpening[] = [
  // Example:
  // {
  //   title: "Senior Stylist",
  //   location: "Austin, TX",
  //   type: "Full-time",
  //   description: "5+ years behind the chair, strong color portfolio.",
  // },
];
