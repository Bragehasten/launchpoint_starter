import { LocalLink as Link } from "@/components/shared/local-link";
import { MapPin, Phone } from "lucide-react";

import { Container } from "@/components/shared/container";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { siteConfig } from "@/config/site";
import { isCapabilityEnabled } from "@/lib/capabilities";
import { getDict, interpolate } from "@/lib/i18n";
import { translateNavTitle } from "@/lib/i18n/nav";
import { getLocations } from "@/lib/capabilities/queries";

/**
 * Footer with sitewide NAP (name–address–phone): consistent NAP across
 * every page is a core local-SEO signal. Shows the primary location; links
 * to /locations when there are more.
 */
export async function SiteFooter() {
  const { locale, dict } = await getDict();
  const locations = isCapabilityEnabled("locations") ? await getLocations() : [];
  const primary = locations.find((l) => l.is_primary) ?? locations[0] ?? null;

  return (
    <footer className="border-t">
      <Container className="flex flex-col gap-8 py-10">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="flex max-w-sm flex-col gap-2">
            <p className="text-sm font-semibold tracking-tight">{siteConfig.name}</p>
            <p className="text-muted-foreground text-sm">{siteConfig.description}</p>
            {primary ? (
              <address className="text-muted-foreground mt-2 flex flex-col gap-1.5 text-sm not-italic">
                <span className="flex items-center gap-2">
                  <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                  <Link href={`/locations/${primary.slug}`} className="hover:underline">
                    {primary.address}
                    {primary.city ? `, ${primary.city}` : ""}
                    {primary.region ? `, ${primary.region}` : ""}
                  </Link>
                </span>
                {primary.phone ? (
                  <span className="flex items-center gap-2">
                    <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                    <a
                      href={`tel:${primary.phone.replace(/[^+\d]/g, "")}`}
                      className="hover:underline"
                    >
                      {primary.phone}
                    </a>
                  </span>
                ) : null}
                {locations.length > 1 ? (
                  <Link href="/locations" className="text-primary hover:underline">
                    {interpolate(dict.footer.allLocations, { count: locations.length })}
                  </Link>
                ) : null}
              </address>
            ) : null}
          </div>
          {siteConfig.features.newsletter ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">{dict.footer.newsletterTitle}</p>
              <NewsletterForm />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {siteConfig.name}. {dict.footer.allRightsReserved}
          </p>
          <nav aria-label="Footer">
            <ul className="flex items-center gap-6">
              {siteConfig.footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {translateNavTitle(item.title, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
