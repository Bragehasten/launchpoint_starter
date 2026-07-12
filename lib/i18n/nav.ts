import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

/**
 * Navigation title translation. Nav titles come from config/modules
 * (framework-standard strings like "Services", "Book", "Free Quote"), so a
 * built-in map covers them; unknown client-custom titles fall back to
 * English rather than breaking. Clients with custom nav labels add their
 * Spanish here or accept the fallback.
 */

const ES_NAV_TITLES: Record<string, string> = {
  Home: "Inicio",
  Services: "Servicios",
  About: "Nosotros",
  Gallery: "Galería",
  Blog: "Blog",
  Contact: "Contacto",
  Menu: "Menú",
  Team: "Equipo",
  "Our Barbers": "Nuestros Barberos",
  Locations: "Ubicaciones",
  "Locations & Hours": "Ubicaciones y Horarios",
  "Our Location": "Nuestra Ubicación",
  "Find Us": "Encuéntranos",
  "Find the Truck": "Encuentra el Food Truck",
  Specials: "Ofertas",
  Promotions: "Promociones",
  Financing: "Financiamiento",
  Book: "Reservar",
  "Book Now": "Reserva Ahora",
  "Book now": "Reserva ahora",
  "Get Started": "Comenzar",
  "Service Areas": "Zonas de Servicio",
  Projects: "Proyectos",
  "Project Gallery": "Galería de Proyectos",
  Quote: "Presupuesto",
  "Free Quote": "Presupuesto Gratis",
  "Free Inspection": "Inspección Gratis",
  "Get started": "Comenzar",
  Careers: "Empleo",
  Privacy: "Privacidad",
  Terms: "Términos",
  Cookies: "Cookies",
};

export function translateNavTitle(title: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return title;
  return ES_NAV_TITLES[title] ?? title;
}
