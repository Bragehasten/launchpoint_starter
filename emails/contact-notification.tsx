import { Hr } from "@react-email/components";

import { EmailShell, EmailText } from "@/emails/components";

type ContactNotificationProps = {
  name: string;
  email: string;
  message: string;
};

/** Sent to the site owner when the contact form is submitted. */
export function ContactNotificationEmail({ name, email, message }: ContactNotificationProps) {
  return (
    <EmailShell preview={`New message from ${name}`} heading="New contact form message">
      <EmailText>
        <strong>{name}</strong> ({email}) sent:
      </EmailText>
      <Hr />
      <EmailText>{message}</EmailText>
      <Hr />
      <EmailText>Reply directly to this email to answer them.</EmailText>
    </EmailShell>
  );
}
