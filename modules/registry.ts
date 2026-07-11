import { barbershop } from "@/modules/barbershop";
import { restaurant } from "@/modules/restaurant";
import { foodTruck } from "@/modules/food-truck";
import { coffeeShop } from "@/modules/coffee-shop";
import { hairSalon } from "@/modules/hair-salon";
import { nailSalon } from "@/modules/nail-salon";
import { tattooStudio } from "@/modules/tattoo-studio";
import { medSpa } from "@/modules/med-spa";
import { electrician } from "@/modules/electrician";
import { plumber } from "@/modules/plumber";
import { hvac } from "@/modules/hvac";
import { roofer } from "@/modules/roofer";
import { landscaper } from "@/modules/landscaper";
import { fenceCompany } from "@/modules/fence-company";
import { paverCompany } from "@/modules/paver-company";
import { generalContractor } from "@/modules/general-contractor";
import { customHomeBuilder } from "@/modules/custom-home-builder";
import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * All industry modules the framework ships. Adding an industry:
 * 1. create modules/<slug>.ts (configuration only, no components)
 * 2. register it here
 * 3. point config/client.ts at it for the client build
 */
export const moduleRegistry = {
  barbershop,
  restaurant,
  foodTruck,
  coffeeShop,
  hairSalon,
  nailSalon,
  tattooStudio,
  medSpa,
  electrician,
  plumber,
  hvac,
  roofer,
  landscaper,
  fenceCompany,
  paverCompany,
  generalContractor,
  customHomeBuilder,
} satisfies Record<string, IndustryModule>;

export type ModuleSlug = keyof typeof moduleRegistry;
