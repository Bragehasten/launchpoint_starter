-- Demo content: barbershop archetype.
-- Run in the SQL editor (or psql) on a fresh client project after
-- migrations. Safe to re-run: deletes its own demo rows first.

delete from public.services where name in ('Classic Cut', 'Skin Fade', 'Beard Trim', 'Hot Towel Shave', 'Kids Cut');
delete from public.service_groups where name in ('Haircuts', 'Shaves & Beards');
delete from public.team_members where name in ('Marcus Webb', 'Danny Ortiz', 'Jerome Carter');
delete from public.locations where name = 'Downtown Shop';
delete from public.promotions where title in ('First Visit — 20% Off', 'Tuesday Senior Special');

insert into public.team_members (name, role, bio, sort_order) values
  ('Marcus Webb', 'Master Barber', '15 years behind the chair. Fades, tapers, and straight-razor work.', 1),
  ('Danny Ortiz', 'Barber & Stylist', 'Precision scissor work and classic styles.', 2),
  ('Jerome Carter', 'Barber', 'The beard whisperer. Book the hot towel shave.', 3);

with groups as (
  insert into public.service_groups (name, description, sort_order) values
    ('Haircuts', null, 1),
    ('Shaves & Beards', 'All shave services include a hot towel finish.', 2)
  returning id, name
)
insert into public.services (group_id, name, description, price, sort_order)
select g.id, s.name, s.description, s.price, s.sort_order
from groups g
join (values
  ('Haircuts', 'Classic Cut', 'Scissor or clipper cut with lineup.', 3500, 1),
  ('Haircuts', 'Skin Fade', 'Zero fade, styled to finish.', 4500, 2),
  ('Haircuts', 'Kids Cut', '12 and under.', 2500, 3),
  ('Shaves & Beards', 'Beard Trim', 'Shape, line, and condition.', 2000, 1),
  ('Shaves & Beards', 'Hot Towel Shave', 'The full ritual. 45 minutes of peace.', 4000, 2)
) as s(group_name, name, description, price, sort_order)
  on s.group_name = g.name;

insert into public.locations (name, slug, address, city, region, postal_code, phone, hours, intro, latitude, longitude, is_primary, sort_order) values
  ('Downtown Shop', 'downtown', '412 Main St', 'Austin', 'TX', '78701', '(512) 555-0134',
   '[{"days":"Tue–Fri","hours":"9:00–18:00"},{"days":"Sat","hours":"8:00–16:00"},{"days":"Sun–Mon","hours":"Closed"}]',
   'Our original shop in the heart of downtown Austin — walk-ins welcome, bookings preferred.',
   30.2672, -97.7431, true, 1);

delete from public.location_reviews where author in ('Marcus T.', 'Danielle R.', 'Chris O.');
insert into public.location_reviews (location_id, author, rating, body, source, sort_order)
select l.id, r.author, r.rating, r.body, r.source, r.sort_order
from public.locations l
join (values
  ('Marcus T.', 5, 'Best fade in Austin, no contest. Marcus takes his time and it shows.', 'google', 1),
  ('Danielle R.', 5, 'Brought my son for his first real haircut — they made it an event. Coming back.', 'google', 2),
  ('Chris O.', 4, 'Hot towel shave is worth every penny. Book ahead, they fill up.', 'yelp', 3)
) as r(author, rating, body, source, sort_order) on true
where l.slug = 'downtown';

insert into public.promotions (title, body, badge, sort_order) values
  ('First Visit — 20% Off', 'New to the shop? Your first cut is 20% off. Just mention this offer.', '20% off', 1),
  ('Tuesday Senior Special', 'Classic cuts for the 65+ crowd, $25 all day Tuesday.', '$25', 2);

-- Spanish translations for the demo content (see docs/i18n.md). Matched on the
-- English source value since seed ids are non-deterministic. Safe to re-run:
-- upserts by (entity, entity_id, locale, field).

insert into public.translations (entity, entity_id, locale, field, value)
select 'service_groups', g.id, 'es', 'name', t.es
from public.service_groups g
join (values
  ('Haircuts', 'Cortes de cabello'),
  ('Shaves & Beards', 'Afeitados y barbas')
) as t(en, es) on g.name = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'service_groups', g.id, 'es', 'description', t.es
from public.service_groups g
join (values
  ('All shave services include a hot towel finish.', 'Todos los servicios de afeitado incluyen un acabado con toalla caliente.')
) as t(en, es) on g.description = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'services', s.id, 'es', 'name', t.es
from public.services s
join (values
  ('Classic Cut', 'Corte clásico'),
  ('Skin Fade', 'Desvanecido a piel'),
  ('Kids Cut', 'Corte para niños'),
  ('Beard Trim', 'Recorte de barba'),
  ('Hot Towel Shave', 'Afeitado con toalla caliente')
) as t(en, es) on s.name = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'services', s.id, 'es', 'description', t.es
from public.services s
join (values
  ('Scissor or clipper cut with lineup.', 'Corte con tijera o máquina con perfilado.'),
  ('Zero fade, styled to finish.', 'Desvanecido a cero, peinado para rematar.'),
  ('12 and under.', 'Para menores de 12 años.'),
  ('Shape, line, and condition.', 'Perfilado, definición y acondicionamiento.'),
  ('The full ritual. 45 minutes of peace.', 'El ritual completo. 45 minutos de calma.')
) as t(en, es) on s.description = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'team_members', m.id, 'es', 'role', t.es
from public.team_members m
join (values
  ('Master Barber', 'Barbero maestro'),
  ('Barber & Stylist', 'Barbero y estilista'),
  ('Barber', 'Barbero')
) as t(en, es) on m.role = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'team_members', m.id, 'es', 'bio', t.es
from public.team_members m
join (values
  ('15 years behind the chair. Fades, tapers, and straight-razor work.', '15 años detrás de la silla. Desvanecidos, degradados y trabajo con navaja.'),
  ('Precision scissor work and classic styles.', 'Trabajo de tijera de precisión y estilos clásicos.'),
  ('The beard whisperer. Book the hot towel shave.', 'El experto en barbas. Reserva el afeitado con toalla caliente.')
) as t(en, es) on m.bio = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'promotions', p.id, 'es', 'title', t.es
from public.promotions p
join (values
  ('First Visit — 20% Off', 'Primera visita — 20% de descuento'),
  ('Tuesday Senior Special', 'Especial de martes para adultos mayores')
) as t(en, es) on p.title = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'promotions', p.id, 'es', 'body', t.es
from public.promotions p
join (values
  ('New to the shop? Your first cut is 20% off. Just mention this offer.', '¿Nuevo en la barbería? Tu primer corte tiene 20% de descuento. Solo menciona esta oferta.'),
  ('Classic cuts for the 65+ crowd, $25 all day Tuesday.', 'Cortes clásicos para mayores de 65 años, $25 todo el día martes.')
) as t(en, es) on p.body = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'promotions', p.id, 'es', 'badge', t.es
from public.promotions p
join (values
  ('20% off', '20% desc.')
) as t(en, es) on p.badge = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'locations', l.id, 'es', 'intro', t.es
from public.locations l
join (values
  ('Our original shop in the heart of downtown Austin — walk-ins welcome, bookings preferred.', 'Nuestra barbería original en el corazón del centro de Austin: se aceptan visitas sin cita, se prefieren las reservas.')
) as t(en, es) on l.intro = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;
