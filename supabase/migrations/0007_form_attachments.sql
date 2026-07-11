-- =============================================================
-- 0007: private storage bucket for form attachments (resumes etc.)
-- =============================================================
-- Uploads happen exclusively through the forms-engine server action, which
-- validates size/type and uses the anon session (insert-only). The bucket is
-- PRIVATE: nobody reads objects except editors, and the admin UI hands out
-- short-lived signed URLs.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'form-attachments',
  'form-attachments',
  false,
  5242880, -- 5 MB
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do nothing;

-- Anyone may upload (the server action is the real gatekeeper; RLS makes the
-- bucket write-only for the public). No public/anon SELECT policy exists, so
-- objects are unreadable without a signed URL.
create policy "Anyone can upload form attachments" on storage.objects for insert
  with check (bucket_id = 'form-attachments');

create policy "Editors read form attachments" on storage.objects for select
  using (bucket_id = 'form-attachments' and public.is_editor());

create policy "Editors delete form attachments" on storage.objects for delete
  using (bucket_id = 'form-attachments' and public.is_editor());
