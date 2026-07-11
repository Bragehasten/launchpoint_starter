import { EmailShell, EmailText } from "@/emails/components";

/** Confirmation sent to the submitter when a form defines an autoresponder. */
export function FormAutoresponseEmail({ heading, body }: { heading: string; body: string }) {
  return (
    <EmailShell preview={heading} heading={heading}>
      <EmailText>{body}</EmailText>
    </EmailShell>
  );
}
