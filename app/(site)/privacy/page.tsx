import type { Metadata } from "next";

import { LegalPage } from "@/components/shared/legal-page";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  path: "/privacy",
  noIndex: false,
});

/**
 * TEMPLATE — review with the client (and their counsel where appropriate)
 * before launch. Placeholders are marked [EDIT].
 */
export default async function PrivacyPage() {
  const locale = await getLocale();

  if (locale === "es") {
    return (
      <LegalPage title="Política de privacidad" lastUpdated="[EDITAR: fecha]" lastUpdatedLabel="Última actualización">
        <h2>Quiénes somos</h2>
        <p>
          {siteConfig.name} (&ldquo;nosotros&rdquo;) opera {siteConfig.url}. Esta política explica qué
          información personal recopilamos y cómo la usamos. ¿Preguntas? Escríbenos a [EDITAR: correo].
        </p>

        <h2>Información que recopilamos</h2>
        <p>
          <strong>Información que nos proporcionas.</strong> Cuando envías un formulario de contacto,
          te suscribes a nuestro boletín o creas una cuenta, recopilamos los datos que proporcionas:
          normalmente tu nombre, correo electrónico y mensaje.
        </p>
        <p>
          <strong>Información recopilada automáticamente.</strong> Usamos analíticas respetuosas con la
          privacidad para entender cómo se usa el sitio (páginas visitadas, ubicación aproximada, tipo
          de dispositivo). Consulta nuestra <a href="/cookies">Política de cookies</a> para más detalles.
        </p>

        <h2>Cómo la usamos</h2>
        <p>
          Para responder a tus consultas, prestar los servicios que solicitas, enviar boletines a los
          que te suscribiste (puedes cancelar en cualquier momento) y mejorar el sitio. No vendemos tu
          información personal.
        </p>

        <h2>Dónde se almacena</h2>
        <p>
          Los datos se almacenan con nuestros proveedores de infraestructura (Supabase para la base de
          datos, Vercel para el alojamiento, Resend para el correo). Cada uno está sujeto a sus propios
          compromisos de seguridad y privacidad.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes solicitar una copia de tus datos o pedirnos que los eliminemos en cualquier momento
          escribiendo a [EDITAR: correo]. Según dónde vivas, podrías tener derechos adicionales (GDPR,
          CCPA).
        </p>

        <h2>Cambios</h2>
        <p>Actualizaremos esta página cuando cambien nuestras prácticas y revisaremos la fecha anterior.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Privacy Policy" lastUpdated="[EDIT: date]">
      <h2>Who we are</h2>
      <p>
        {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates {siteConfig.url}. This
        policy explains what personal information we collect and how we use it. Questions? Contact
        us at [EDIT: email].
      </p>

      <h2>Information we collect</h2>
      <p>
        <strong>Information you give us.</strong> When you submit a contact form, subscribe to our
        newsletter, or create an account, we collect the details you provide — typically your name,
        email address, and message.
      </p>
      <p>
        <strong>Information collected automatically.</strong> We use privacy-respecting analytics to
        understand how the site is used (pages visited, approximate location, device type). See our{" "}
        <a href="/cookies">Cookie Policy</a> for details.
      </p>

      <h2>How we use it</h2>
      <p>
        To respond to your inquiries, provide services you request, send newsletters you opted into
        (unsubscribe anytime), and improve the site. We do not sell your personal information.
      </p>

      <h2>Where it’s stored</h2>
      <p>
        Data is stored with our infrastructure providers (Supabase for the database, Vercel for
        hosting, Resend for email). Each is bound by its own security and privacy commitments.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request a copy of your data or ask us to delete it at any time by contacting [EDIT:
        email]. Depending on where you live, you may have additional rights (GDPR, CCPA).
      </p>

      <h2>Changes</h2>
      <p>We’ll update this page when our practices change and revise the date above.</p>
    </LegalPage>
  );
}
