import type { Metadata } from "next";

import { LegalPage } from "@/components/shared/legal-page";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  path: "/terms",
});

/**
 * TEMPLATE — review with the client (and their counsel where appropriate)
 * before launch. Placeholders are marked [EDIT].
 */
export default async function TermsPage() {
  const locale = await getLocale();

  if (locale === "es") {
    return (
      <LegalPage title="Términos del servicio" lastUpdated="[EDITAR: fecha]" lastUpdatedLabel="Última actualización">
        <h2>Acuerdo</h2>
        <p>
          Al usar {siteConfig.url}, aceptas estos términos. Si no estás de acuerdo, por favor no uses
          el sitio.
        </p>

        <h2>Uso del sitio</h2>
        <p>
          El contenido de este sitio se proporciona con fines de información general sobre{" "}
          {siteConfig.name} y sus servicios. No puedes hacer un mal uso del sitio, intentar acceder a
          él por medios no autorizados ni usarlo para transmitir contenido ilícito.
        </p>

        <h2>Cuentas</h2>
        <p>
          Si creas una cuenta, eres responsable de mantener seguras tus credenciales y de la actividad
          realizada bajo tu cuenta.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          El contenido, el diseño y la marca del sitio pertenecen a {siteConfig.name} o a sus
          licenciantes y no pueden reproducirse sin permiso.
        </p>

        <h2>Descargo de responsabilidad y responsabilidad</h2>
        <p>
          El sitio se proporciona &ldquo;tal cual&rdquo; sin garantías de ningún tipo. En la medida
          permitida por la ley, {siteConfig.name} no es responsable de daños indirectos o
          consecuentes derivados del uso del sitio. [EDITAR: ajusta a tu jurisdicción.]
        </p>

        <h2>Contacto</h2>
        <p>Preguntas sobre estos términos: [EDITAR: correo].</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Terms of Service" lastUpdated="[EDIT: date]">
      <h2>Agreement</h2>
      <p>
        By using {siteConfig.url}, you agree to these terms. If you don’t agree, please don’t use
        the site.
      </p>

      <h2>Use of the site</h2>
      <p>
        Content on this site is provided for general information about {siteConfig.name} and its
        services. You may not misuse the site, attempt to access it by unauthorized means, or use it
        to transmit anything unlawful.
      </p>

      <h2>Accounts</h2>
      <p>
        If you create an account, you’re responsible for keeping your credentials secure and for
        activity under your account.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The site’s content, design, and branding belong to {siteConfig.name} or its licensors and
        may not be reproduced without permission.
      </p>

      <h2>Disclaimer & liability</h2>
      <p>
        The site is provided &ldquo;as is&rdquo; without warranties of any kind. To the extent
        permitted by law, {siteConfig.name} is not liable for indirect or consequential damages
        arising from use of the site. [EDIT: adjust to your jurisdiction.]
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms: [EDIT: email].</p>
    </LegalPage>
  );
}
