import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/** Spanish UI strings. Must satisfy Dictionary — missing keys fail tsc. */
export const es: Dictionary = {
  common: {
    skipToContent: "Saltar al contenido",
    backToHome: "Volver al inicio",
    loading: "Cargando página",
    selectPlaceholder: "Seleccionar…",
    pageNotFound: "Página no encontrada",
    pageNotFoundBody: "La página que buscas no existe o se ha movido.",
    errorTitle: "Algo salió mal",
    tryAgain: "Intentar de nuevo",
    switchLanguage: "In English",
    switchLanguageHref: "/",
  },
  footer: {
    newsletterTitle: "Suscríbete a nuestro boletín",
    newsletterButton: "Suscribirse",
    allRightsReserved: "Todos los derechos reservados.",
    allLocations: "Las {count} ubicaciones",
  },
  booking: {
    minuteAppointments: "Citas de {minutes} minutos. Elige día y hora.",
    previous: "Anterior",
    next: "Siguiente",
    closedThisDay: "Cerrado este día — prueba otra fecha.",
    selectTime: "Selecciona una hora arriba para continuar.",
    requested: "Reserva solicitada — te confirmaremos por correo en breve.",
    confirm: "Confirmar reserva",
    name: "Nombre",
    email: "Correo electrónico",
    phoneOptional: "Teléfono (opcional)",
    notesOptional: "Notas (opcional)",
  },
  locations: {
    allLocations: "Todas las ubicaciones",
    mainLocation: "Ubicación principal",
    teamHere: "El equipo aquí",
    customersSay: "Lo que dicen nuestros clientes",
    contactLocation: "Contacta con {name}",
    contactLocationBody: "¿Preguntas sobre esta ubicación? Envíanos un mensaje.",
  },
  serviceAreas: {
    allAreas: "Todas las zonas de servicio",
    whatWeDo: "Lo que hacemos en {area}",
    questions: "Preguntas sobre {area}",
    freeQuote: "Obtén un presupuesto gratis en {area}",
    freeQuoteBody: "Cuéntanos sobre el trabajo — respondemos en un día hábil.",
    alsoServing: "También servimos",
    inArea: "{noun} en {area}",
  },
} as const;
