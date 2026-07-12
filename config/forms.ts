import type { FormDef } from "@/lib/forms/types";

/**
 * PER-CLIENT FORM CATALOG.
 *
 * Every form the framework ships, as pure configuration. Enable the ones a
 * client needs in `enabledForms`; each enabled slug gets /forms/<slug>
 * automatically (contact and quote keep their classic URLs too), can be
 * embedded in any CMS page via the "form" section, and lands in the admin
 * inbox filtered under its own kind.
 */

const name = {
  name: "name",
  label: "Name",
  autoComplete: "name",
  half: true,
} as const;
const email = {
  name: "email",
  label: "Email",
  type: "email",
  autoComplete: "email",
  half: true,
} as const;
const phone = { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" } as const;

export const formRegistry: Record<string, FormDef> = {
  contact: {
    slug: "contact",
    title: "Contact us",
    fields: [
      { ...name, type: "text" },
      email,
      { name: "message", label: "Message", type: "textarea", placeholder: "How can we help?" },
    ],
    submitLabel: "Send message",
    successMessage: "Thanks — we'll get back to you shortly.",
    subject: (v) => `New contact message from ${v.name}`,
    es: {
      title: "Contáctanos",
      submitLabel: "Enviar mensaje",
      successMessage: "Gracias — te responderemos pronto.",
      fields: {
        name: { label: "Nombre" },
        email: { label: "Correo electrónico" },
        message: { label: "Mensaje", placeholder: "¿En qué podemos ayudarte?" },
      },
    },
  },

  quote: {
    slug: "quote",
    title: "Request a quote",
    intro: "Tell us about the job and we'll get back with a free estimate.",
    fields: [
      { ...name, type: "text" },
      email,
      { ...phone, required: false },
      {
        name: "details",
        label: "Project details",
        type: "textarea",
        placeholder: "What are we working on? Rough size, timeline, anything useful.",
      },
    ],
    submitLabel: "Request quote",
    successMessage: "Thanks — we'll get back to you with a quote shortly.",
    subject: (v) => `New quote request from ${v.name}`,
    es: {
      title: "Solicita un presupuesto",
      intro: "Cuéntanos sobre el trabajo y te enviaremos un presupuesto gratis.",
      submitLabel: "Solicitar presupuesto",
      successMessage: "Gracias — te enviaremos un presupuesto pronto.",
      fields: {
        name: { label: "Nombre" },
        email: { label: "Correo electrónico" },
        phone: { label: "Teléfono" },
        details: {
          label: "Detalles del proyecto",
          placeholder: "¿Qué necesitas? Tamaño aproximado, plazos, lo que sea útil.",
        },
      },
    },
  },

  "booking-request": {
    slug: "booking-request",
    title: "Request an appointment",
    intro: "Tell us when works and we'll confirm by email or phone.",
    fields: [
      { ...name, type: "text" },
      email,
      phone,
      { name: "preferred_date", label: "Preferred date", type: "date", half: true },
      {
        name: "preferred_time",
        label: "Preferred time",
        type: "select",
        half: true,
        options: [
          { value: "morning", label: "Morning" },
          { value: "afternoon", label: "Afternoon" },
          { value: "evening", label: "Evening" },
        ],
      },
      { name: "notes", label: "Notes", type: "textarea", required: false, rows: 3 },
    ],
    submitLabel: "Request appointment",
    successMessage: "Request received — we'll confirm your appointment shortly.",
    subject: (v) => `Appointment request from ${v.name} (${v.preferred_date})`,
    autoresponder: {
      subject: "We got your appointment request",
      body: "Thanks for reaching out — we've received your appointment request and will confirm a time with you shortly.",
    },
    es: {
      title: "Solicita una cita",
      intro: "Dinos cuándo te viene bien y confirmaremos por correo o teléfono.",
      submitLabel: "Solicitar cita",
      successMessage: "Solicitud recibida — confirmaremos tu cita en breve.",
      autoresponder: {
        subject: "Recibimos tu solicitud de cita",
        body: "Gracias por contactarnos — hemos recibido tu solicitud y confirmaremos un horario contigo en breve.",
      },
      fields: {
        name: { label: "Nombre" },
        email: { label: "Correo electrónico" },
        phone: { label: "Teléfono" },
        preferred_date: { label: "Fecha preferida" },
        preferred_time: { label: "Hora preferida" },
        notes: { label: "Notas" },
      },
    },
  },

  employment: {
    slug: "employment",
    title: "Work with us",
    intro: "Tell us about yourself and attach a résumé if you have one.",
    fields: [
      { ...name, type: "text" },
      email,
      { ...phone, required: false },
      { name: "position", label: "Position of interest", type: "text", maxLength: 120 },
      {
        name: "experience",
        label: "Experience",
        type: "textarea",
        placeholder: "A short summary — or just link your LinkedIn.",
      },
      {
        name: "resume",
        label: "Résumé (PDF or Word, max 5 MB)",
        type: "file",
        required: false,
        accept: ".pdf,.doc,.docx",
      },
    ],
    submitLabel: "Submit application",
    successMessage: "Application received — thanks for your interest!",
    subject: (v) => `Job application: ${v.position} — ${v.name}`,
    autoresponder: {
      subject: "We received your application",
      body: "Thanks for applying — we review every application and will reach out if there's a fit.",
    },
    es: {
      title: "Trabaja con nosotros",
      intro: "Cuéntanos sobre ti y adjunta tu currículum si lo tienes.",
      submitLabel: "Enviar solicitud",
      successMessage: "Solicitud recibida — ¡gracias por tu interés!",
      autoresponder: {
        subject: "Recibimos tu solicitud",
        body: "Gracias por postularte — revisamos cada solicitud y te contactaremos si hay una vacante adecuada.",
      },
      fields: {
        name: { label: "Nombre" },
        email: { label: "Correo electrónico" },
        phone: { label: "Teléfono" },
        position: { label: "Puesto de interés" },
        experience: {
          label: "Experiencia",
          placeholder: "Un resumen breve — o comparte tu LinkedIn.",
        },
        resume: { label: "Currículum (PDF o Word, máx. 5 MB)" },
      },
    },
  },

  catering: {
    slug: "catering",
    title: "Catering inquiry",
    intro: "Events, offices, weddings — tell us about yours.",
    fields: [
      { ...name, type: "text" },
      email,
      phone,
      { name: "event_date", label: "Event date", type: "date", half: true },
      { name: "guest_count", label: "Guest count", type: "text", half: true, maxLength: 10 },
      {
        name: "details",
        label: "Event details",
        type: "textarea",
        placeholder: "Venue, style of service, dietary needs…",
      },
    ],
    submitLabel: "Send inquiry",
    successMessage: "Inquiry received — we'll follow up with menu options and pricing.",
    subject: (v) => `Catering inquiry for ${v.event_date} (${v.guest_count} guests)`,
    es: {
      title: "Consulta de catering",
      intro: "Eventos, oficinas, bodas — cuéntanos sobre el tuyo.",
      submitLabel: "Enviar consulta",
      successMessage: "Consulta recibida — te enviaremos opciones de menú y precios.",
      fields: {
        name: { label: "Nombre" },
        email: { label: "Correo electrónico" },
        phone: { label: "Teléfono" },
        event_date: { label: "Fecha del evento" },
        guest_count: { label: "Número de invitados" },
        details: {
          label: "Detalles del evento",
          placeholder: "Lugar, tipo de servicio, necesidades dietéticas…",
        },
      },
    },
  },

  consultation: {
    slug: "consultation",
    title: "Book a consultation",
    intro: "A no-pressure conversation about what you're looking for.",
    fields: [
      { ...name, type: "text" },
      email,
      { ...phone, required: false },
      {
        name: "topic",
        label: "What's this about?",
        type: "textarea",
        placeholder: "The more context, the more useful the consultation.",
      },
    ],
    submitLabel: "Request consultation",
    successMessage: "Request received — we'll reach out to schedule your consultation.",
    subject: (v) => `Consultation request from ${v.name}`,
    autoresponder: {
      subject: "Your consultation request",
      body: "Thanks — we've received your consultation request and will reach out shortly to find a time.",
    },
    es: {
      title: "Agenda una consulta",
      intro: "Una conversación sin compromiso sobre lo que buscas.",
      submitLabel: "Solicitar consulta",
      successMessage: "Solicitud recibida — te contactaremos para agendar tu consulta.",
      autoresponder: {
        subject: "Tu solicitud de consulta",
        body: "Gracias — hemos recibido tu solicitud de consulta y te contactaremos pronto para encontrar un horario.",
      },
      fields: {
        name: { label: "Nombre" },
        email: { label: "Correo electrónico" },
        phone: { label: "Teléfono" },
        topic: {
          label: "¿De qué se trata?",
          placeholder: "Cuanto más contexto, más útil será la consulta.",
        },
      },
    },
  },

  "emergency-service": {
    slug: "emergency-service",
    title: "Emergency service",
    intro: "Burst pipe? No AC in August? Describe it briefly — we prioritize these requests.",
    emergency: true,
    fields: [
      { ...name, type: "text" },
      phone, // phone FIRST-class for emergencies; email still required for the record
      email,
      { name: "address", label: "Service address", type: "text", autoComplete: "street-address" },
      {
        name: "issue",
        label: "What's happening?",
        type: "textarea",
        rows: 3,
        minLength: 5,
        placeholder: "Short and specific beats long and polite.",
      },
    ],
    submitLabel: "Request emergency service",
    successMessage: "Request received — we'll call you back as fast as we can.",
    subject: (v) => `Emergency service: ${(v.issue ?? "").slice(0, 60)}`,
    es: {
      title: "Servicio de emergencia",
      intro:
        "¿Tubería rota? ¿Sin aire en pleno agosto? Descríbelo brevemente — priorizamos estas solicitudes.",
      submitLabel: "Solicitar servicio de emergencia",
      successMessage: "Solicitud recibida — te llamaremos lo antes posible.",
      fields: {
        name: { label: "Nombre" },
        phone: { label: "Teléfono" },
        email: { label: "Correo electrónico" },
        address: { label: "Dirección del servicio" },
        issue: {
          label: "¿Qué está pasando?",
          placeholder: "Corto y específico es mejor que largo y cortés.",
        },
      },
    },
  },
};

/**
 * Forms this client exposes. Disabled forms 404 at /forms/<slug> and are
 * rejected by the engine action. Demo ships the barbershop-relevant trio.
 */
export const enabledForms: readonly string[] = ["contact", "quote", "employment"];

export function getFormDef(slug: string): FormDef | null {
  if (!enabledForms.includes(slug)) return null;
  return formRegistry[slug] ?? null;
}
