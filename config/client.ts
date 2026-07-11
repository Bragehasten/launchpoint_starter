import { defineClient } from "@/lib/capabilities/types";
import { barbershop } from "@/modules/barbershop";

/**
 * PER-CLIENT ASSEMBLY — this file is the industry switch.
 *
 * Cloning the kit for a new client: pick a module from modules/, add
 * overrides if the client deviates, done. The demo ships as a barbershop
 * so every capability has something to show.
 */
export const clientConfig = defineClient({
  module: barbershop,
  overrides: {
    // Example: a client whose gallery isn't ready yet
    // gallery: { enabled: false },
  },
});
