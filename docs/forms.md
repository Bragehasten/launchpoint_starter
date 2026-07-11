# Forms Engine

One engine, many forms. A form is a typed definition in `config/forms.ts` —
the Zod schema, the rendered form, the server handling, the notification
email, and the admin inbox entry are all derived from it.

## Shipped forms

contact · quote · booking-request · employment (résumé upload) · catering ·
consultation · emergency-service. Newsletter stays a bespoke footer widget.

## Enabling forms per client

```ts
// config/forms.ts
export const enabledForms = ["contact", "quote", "employment"];
```

Every enabled form gets `/forms/<slug>` automatically (contact and quote
also keep their classic `/contact` and `/quote` URLs), appears in the
sitemap, and can be embedded in any CMS page with a `form` section block:

```json
{ "type": "form", "form": "catering", "heading": { "title": "Cater your event" } }
```

## Adding a form

Add a `FormDef` to `formRegistry`: fields (text/email/tel/date/textarea/
select/checkbox/file), a success message, optionally a subject template and
an autoresponder. Conventions: every form includes an `email` field;
`half: true` pairs consecutive fields into two columns.

## Behavior that comes free

- Validation from one schema, client and server.
- Honeypot + per-IP rate limiting + insert-only RLS.
- Owner notification (reply-to = submitter) when `CONTACT_EMAIL` is set;
  optional autoresponder to the submitter.
- **File uploads** go to the private `form-attachments` bucket (5 MB;
  PDF/Word/images — enforced in the action AND by bucket constraints from
  migration 0007). Admins download via 1-hour signed URLs in the inbox;
  attachment links never appear in email.
- **Emergency forms** (`emergency: true`): 🚨 URGENT-prefixed subject and a
  marked seam in `actions/form-engine.tsx` for SMS (backlog #24).
- Inbox filtering by form kind, full payload rendered per submission.

## What stays out of the engine

The native booking flow (`/book`) — real slot inventory with DB-level
conflict prevention is a capability, not a form. `booking-request` is the
lightweight alternative for clients who confirm by phone.
