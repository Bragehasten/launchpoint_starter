import { Section, Text } from "@react-email/components";

import { EmailShell } from "@/emails/components";

/**
 * Generic owner notification for any engine form: a labeled row per field.
 * Attachments are deliberately NOT linked from email — admins open them via
 * signed URLs in the dashboard.
 */

const labelStyle = {
  color: "#a3a3a3",
  fontSize: "11px",
  letterSpacing: "0.05em",
  margin: "0 0 2px",
  textTransform: "uppercase" as const,
};

const valueStyle = {
  color: "#404040",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 12px",
  whiteSpace: "pre-wrap" as const,
};

export function FormSubmissionEmail({
  formTitle,
  rows,
}: {
  formTitle: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <EmailShell preview={`New ${formTitle} submission`} heading={`New ${formTitle} submission`}>
      {rows.map((row) => (
        <Section key={row.label}>
          <Text style={labelStyle}>{row.label}</Text>
          <Text style={valueStyle}>{row.value}</Text>
        </Section>
      ))}
      <Text style={{ color: "#a3a3a3", fontSize: "12px", marginTop: "16px" }}>
        Reply to this email to respond directly. Attachments (if any) are in the admin inbox.
      </Text>
    </EmailShell>
  );
}
