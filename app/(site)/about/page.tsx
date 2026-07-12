import type { Metadata } from "next";

import { Cta, Hero, Stats, Team, Timeline } from "@/components/sections";
import { createMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: "Who we are and how we work.",
  path: "/about",
});

/** Demo content — replace per client (or convert to a CMS page). */

const en = {
  hero: {
    eyebrow: "About us",
    title: "Built by people who care about the details",
    description:
      "We believe a website should be an asset, not an expense — fast, beautiful, and easy to keep current.",
  },
  stats: [
    { value: "120+", label: "Projects delivered" },
    { value: "10 yrs", label: "In business" },
    { value: "98%", label: "Client retention" },
    { value: "4.9★", label: "Average review" },
  ],
  process: {
    heading: { eyebrow: "Our process", title: "How we work" },
    steps: [
      {
        title: "Discover",
        description: "We learn your business, customers, and goals before anything is designed.",
      },
      {
        title: "Design",
        description: "A design tailored to your brand — reviewed together, refined fast.",
      },
      {
        title: "Build",
        description: "Production-grade engineering with performance and SEO built in.",
      },
      {
        title: "Launch & grow",
        description: "We ship, measure, and keep improving after launch.",
      },
    ],
  },
  team: {
    heading: { eyebrow: "The team", title: "The people behind the work" },
    members: [
      { name: "Patricio Bernal", role: "Founder" },
      { name: "Alex Chen", role: "Design Lead" },
      { name: "Sam Rodriguez", role: "Engineering" },
      { name: "Jordan Lee", role: "Client Success" },
    ],
  },
  cta: { title: "Want to work together?", action: "Get in touch" },
};

const es: typeof en = {
  hero: {
    eyebrow: "Sobre nosotros",
    title: "Creado por personas que cuidan cada detalle",
    description:
      "Creemos que un sitio web debe ser un activo, no un gasto: rápido, hermoso y fácil de mantener al día.",
  },
  stats: [
    { value: "120+", label: "Proyectos entregados" },
    { value: "10 años", label: "En el negocio" },
    { value: "98%", label: "Retención de clientes" },
    { value: "4.9★", label: "Reseña promedio" },
  ],
  process: {
    heading: { eyebrow: "Nuestro proceso", title: "Cómo trabajamos" },
    steps: [
      {
        title: "Descubrir",
        description:
          "Conocemos tu negocio, tus clientes y tus objetivos antes de diseñar cualquier cosa.",
      },
      {
        title: "Diseñar",
        description: "Un diseño a la medida de tu marca: revisado en conjunto y refinado rápido.",
      },
      {
        title: "Construir",
        description: "Ingeniería de nivel profesional con rendimiento y SEO integrados.",
      },
      {
        title: "Lanzar y crecer",
        description: "Publicamos, medimos y seguimos mejorando después del lanzamiento.",
      },
    ],
  },
  team: {
    heading: { eyebrow: "El equipo", title: "Las personas detrás del trabajo" },
    members: [
      { name: "Patricio Bernal", role: "Fundador" },
      { name: "Alex Chen", role: "Líder de Diseño" },
      { name: "Sam Rodriguez", role: "Ingeniería" },
      { name: "Jordan Lee", role: "Éxito del Cliente" },
    ],
  },
  cta: { title: "¿Quieres trabajar con nosotros?", action: "Ponte en contacto" },
};

const content = { en, es };

export default async function AboutPage() {
  const t = content[await getLocale()];

  return (
    <>
      <Hero eyebrow={t.hero.eyebrow} title={t.hero.title} description={t.hero.description} />
      <Stats stats={t.stats} />
      <Timeline heading={t.process.heading} steps={t.process.steps} />
      <Team heading={t.team.heading} members={t.team.members} />
      <Cta title={t.cta.title} actions={[{ label: t.cta.action, href: "/contact" }]} />
    </>
  );
}
