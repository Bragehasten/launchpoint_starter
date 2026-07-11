import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { siteConfig } from "@/config/site";

/**
 * Shared email shell so every template matches the site's identity.
 * Inline styles only — email clients ignore stylesheets.
 */

const styles = {
  body: { backgroundColor: "#f5f5f5", fontFamily: "ui-sans-serif, system-ui, sans-serif" },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    margin: "40px auto",
    maxWidth: "560px",
    padding: "32px",
  },
  brand: { color: "#171717", fontSize: "14px", fontWeight: 600 as const, marginBottom: "24px" },
  heading: { color: "#171717", fontSize: "20px", fontWeight: 700 as const, margin: "0 0 16px" },
  text: { color: "#404040", fontSize: "14px", lineHeight: "24px" },
  footer: { color: "#a3a3a3", fontSize: "12px", marginTop: "32px" },
} as const;

type EmailShellProps = {
  preview: string;
  heading: string;
  children: React.ReactNode;
};

export function EmailShell({ preview, heading, children }: EmailShellProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>{siteConfig.name}</Text>
          <Heading style={styles.heading}>{heading}</Heading>
          <Section>{children}</Section>
          <Text style={styles.footer}>
            © {new Date().getFullYear()} {siteConfig.name}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function EmailText({ children }: { children: React.ReactNode }) {
  return <Text style={styles.text}>{children}</Text>;
}
