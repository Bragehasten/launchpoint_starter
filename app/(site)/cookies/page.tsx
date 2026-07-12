import type { Metadata } from "next";

import { LegalPage } from "@/components/shared/legal-page";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  path: "/cookies",
});

/**
 * TEMPLATE — keep in sync with what the site actually sets. Placeholders
 * are marked [EDIT].
 */
export default async function CookiePolicyPage() {
  const locale = await getLocale();

  if (locale === "es") {
    return (
      <LegalPage title="Política de cookies" lastUpdated="[EDITAR: fecha]" lastUpdatedLabel="Última actualización">
        <h2>Qué cookies usamos</h2>
        <p>
          {siteConfig.name} usa un número reducido de cookies y tecnologías similares. Puedes
          gestionar las cookies no esenciales mediante el banner de consentimiento.
        </p>

        <h2>Esenciales</h2>
        <p>
          Necesarias para que el sitio funcione: cookies de sesión de autenticación (solo si inicias
          sesión) y tu propia elección de consentimiento de cookies. Estas no se pueden desactivar.
        </p>

        <h2>Analíticas</h2>
        <p>
          Con tu consentimiento, usamos analíticas respetuosas con la privacidad para entender el uso
          del sitio. Miden las visitas a las páginas y el rendimiento sin crear perfiles publicitarios.
          [EDITAR: nombra al proveedor de analíticas una vez habilitado.]
        </p>

        <h2>Gestionar preferencias</h2>
        <p>
          Puedes cambiar tu elección en cualquier momento borrando los datos de este sitio en tu
          navegador, lo que volverá a mostrar el banner de consentimiento en tu próxima visita.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Cookie Policy" lastUpdated="[EDIT: date]">
      <h2>What cookies we use</h2>
      <p>
        {siteConfig.name} uses a small number of cookies and similar technologies. You can manage
        non-essential cookies through the consent banner.
      </p>

      <h2>Essential</h2>
      <p>
        Required for the site to function: authentication session cookies (only if you sign in) and
        your cookie-consent choice itself. These cannot be switched off.
      </p>

      <h2>Analytics</h2>
      <p>
        With your consent, we use privacy-respecting analytics to understand site usage. These
        measure page views and performance without building advertising profiles. [EDIT: name the
        analytics provider once enabled.]
      </p>

      <h2>Managing preferences</h2>
      <p>
        You can change your choice anytime by clearing this site’s data in your browser, which will
        re-show the consent banner on your next visit.
      </p>
    </LegalPage>
  );
}
