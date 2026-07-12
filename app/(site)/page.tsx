import { Gauge, LayoutTemplate, Lock, Moon, Search, Smartphone } from "lucide-react";

import { Cta, Faq, Features, Hero, Testimonials } from "@/components/sections";
import { getLocale } from "@/lib/i18n";

/**
 * Demo homepage. Composed entirely from section components with typed
 * content — this is the pattern every client site follows. Copy lives in a
 * locale-keyed object so the page renders in the visitor's language (the
 * Spanish half is shape-checked against English via `es: typeof en`).
 */

const en = {
  hero: {
    eyebrow: "LaunchPoint Starter Kit",
    title: "Websites that feel expensive, shipped fast",
    description:
      "A production-grade foundation: fast, accessible, and ready to ship for every client.",
    getStarted: "Get started",
    learnMore: "Learn more",
  },
  features: {
    heading: {
      eyebrow: "Why LaunchPoint",
      title: "Everything a premium site needs, built in",
      description: "No plugins to glue together. One coherent, tested foundation.",
    },
    items: [
      {
        title: "Performance first",
        description:
          "Static rendering, optimized images and fonts. Lighthouse 95+ as a baseline.",
      },
      {
        title: "SEO ready",
        description:
          "Dynamic metadata, Open Graph images, structured data, and sitemaps out of the box.",
      },
      {
        title: "Dark mode",
        description: "System-aware theming with zero flash, driven entirely by design tokens.",
      },
      {
        title: "Mobile first",
        description: "Every component designed for small screens first and enhanced upward.",
      },
      {
        title: "Secure by default",
        description: "Validated input at every boundary, security headers, and row-level security.",
      },
      {
        title: "Composable sections",
        description:
          "Assemble complete pages from typed, reusable sections — no custom CSS needed.",
      },
    ],
  },
  testimonials: {
    heading: { eyebrow: "Testimonials", title: "Trusted by ambitious teams" },
    items: [
      {
        quote:
          "The site paid for itself in the first month. Fast, beautiful, and effortless to update.",
        author: "Alex Rivera",
        role: "Founder, Northwind",
      },
      {
        quote:
          "Our Lighthouse scores went from 60s to high 90s. Search traffic followed within weeks.",
        author: "Priya Shah",
        role: "Marketing Director, Acme Co",
      },
      {
        quote:
          "The admin dashboard is so simple our whole team publishes without touching a developer.",
        author: "Marcus Lee",
        role: "COO, Brightline",
      },
    ],
  },
  faq: {
    heading: { eyebrow: "FAQ", title: "Common questions" },
    items: [
      {
        question: "How fast can a new site launch?",
        answer:
          "Most sites go from kickoff to live in a matter of weeks. The foundation is already production-ready — time goes into your content and brand, not plumbing.",
      },
      {
        question: "Can I edit content myself?",
        answer:
          "Yes. The built-in CMS lets your team create, preview, and publish content from an admin dashboard — no developer required.",
      },
      {
        question: "Is it accessible?",
        answer:
          "Accessibility is built into every component: keyboard navigation, screen reader support, and reduced-motion preferences are respected throughout.",
      },
    ],
  },
  cta: {
    title: "Ready to launch?",
    description: "Get a fast, beautiful, maintainable website built on a proven foundation.",
    action: "Start your project",
  },
};

const es: typeof en = {
  hero: {
    eyebrow: "Kit inicial LaunchPoint",
    title: "Sitios web que se sienten premium, lanzados rápido",
    description:
      "Una base de nivel profesional: rápida, accesible y lista para lanzar con cada cliente.",
    getStarted: "Comenzar",
    learnMore: "Más información",
  },
  features: {
    heading: {
      eyebrow: "Por qué LaunchPoint",
      title: "Todo lo que un sitio premium necesita, ya integrado",
      description: "Sin complementos que unir. Una base coherente y probada.",
    },
    items: [
      {
        title: "Rendimiento primero",
        description:
          "Renderizado estático, imágenes y fuentes optimizadas. Lighthouse 95+ como punto de partida.",
      },
      {
        title: "Listo para SEO",
        description:
          "Metadatos dinámicos, imágenes Open Graph, datos estructurados y sitemaps desde el inicio.",
      },
      {
        title: "Modo oscuro",
        description:
          "Tema que se adapta al sistema sin parpadeos, impulsado por completo con design tokens.",
      },
      {
        title: "Diseño móvil primero",
        description:
          "Cada componente diseñado primero para pantallas pequeñas y mejorado hacia arriba.",
      },
      {
        title: "Seguro por defecto",
        description:
          "Entradas validadas en cada límite, encabezados de seguridad y seguridad a nivel de fila.",
      },
      {
        title: "Secciones combinables",
        description:
          "Arma páginas completas con secciones tipadas y reutilizables, sin CSS personalizado.",
      },
    ],
  },
  testimonials: {
    heading: { eyebrow: "Testimonios", title: "La confianza de equipos ambiciosos" },
    items: [
      {
        quote:
          "El sitio se pagó solo en el primer mes. Rápido, hermoso y muy fácil de actualizar.",
        author: "Alex Rivera",
        role: "Fundador, Northwind",
      },
      {
        quote:
          "Nuestros puntajes de Lighthouse pasaron de 60 a más de 90. El tráfico de búsqueda llegó en semanas.",
        author: "Priya Shah",
        role: "Directora de Marketing, Acme Co",
      },
      {
        quote:
          "El panel de administración es tan simple que todo el equipo publica sin depender de un desarrollador.",
        author: "Marcus Lee",
        role: "Director de Operaciones, Brightline",
      },
    ],
  },
  faq: {
    heading: { eyebrow: "Preguntas frecuentes", title: "Preguntas comunes" },
    items: [
      {
        question: "¿Qué tan rápido puede lanzarse un sitio nuevo?",
        answer:
          "La mayoría de los sitios pasan del inicio a estar en vivo en cuestión de semanas. La base ya está lista para producción: el tiempo se dedica a tu contenido y marca, no a la infraestructura.",
      },
      {
        question: "¿Puedo editar el contenido yo mismo?",
        answer:
          "Sí. El CMS integrado permite a tu equipo crear, previsualizar y publicar contenido desde un panel de administración, sin necesidad de un desarrollador.",
      },
      {
        question: "¿Es accesible?",
        answer:
          "La accesibilidad está integrada en cada componente: navegación por teclado, compatibilidad con lectores de pantalla y respeto por las preferencias de movimiento reducido en todo el sitio.",
      },
    ],
  },
  cta: {
    title: "¿Listo para lanzar?",
    description:
      "Obtén un sitio web rápido, hermoso y fácil de mantener, construido sobre una base probada.",
    action: "Inicia tu proyecto",
  },
};

const content = { en, es };

export default async function HomePage() {
  const t = content[await getLocale()];
  const featureIcons = [Gauge, Search, Moon, Smartphone, Lock, LayoutTemplate];

  return (
    <>
      <Hero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        description={t.hero.description}
        actions={[
          { label: t.hero.getStarted, href: "/contact" },
          { label: t.hero.learnMore, href: "/about", variant: "outline" },
        ]}
      />
      <Features
        heading={t.features.heading}
        features={t.features.items.map((f, i) => ({ ...f, icon: featureIcons[i] }))}
      />
      <Testimonials heading={t.testimonials.heading} testimonials={t.testimonials.items} />
      <Faq heading={t.faq.heading} items={t.faq.items} />
      <Cta
        title={t.cta.title}
        description={t.cta.description}
        actions={[{ label: t.cta.action, href: "/contact" }]}
      />
    </>
  );
}
