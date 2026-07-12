-- Demo content: roofer archetype (trades). Pairs with modules/roofer.ts.
-- Safe to re-run: deletes its own demo rows first.
-- NOTE the service-area intros: each is genuinely different. That's the
-- standard — swapped-city-name boilerplate is what gets sites ignored.

delete from public.services where name in ('Roof Replacement', 'Roof Repair', 'Storm Damage Inspection', 'Gutter Installation', 'Metal Roofing');
delete from public.service_groups where name in ('Residential Roofing', 'Specialty');
delete from public.locations where slug = 'stuart-office';
delete from public.service_areas where slug in ('palm-beach', 'jupiter', 'port-st-lucie', 'fort-pierce', 'stuart');

with groups as (
  insert into public.service_groups (name, description, sort_order) values
    ('Residential Roofing', null, 1),
    ('Specialty', null, 2)
  returning id, name
)
insert into public.services (group_id, name, description, price, sort_order)
select g.id, s.name, s.description, null, s.sort_order
from groups g
join (values
  ('Residential Roofing', 'Roof Replacement', 'Full tear-off and replacement, shingle or tile.', 1),
  ('Residential Roofing', 'Roof Repair', 'Leaks, missing shingles, flashing, soffit and fascia.', 2),
  ('Residential Roofing', 'Storm Damage Inspection', 'Free inspection with insurance-claim documentation.', 3),
  ('Specialty', 'Metal Roofing', 'Standing seam and 5V metal systems.', 1),
  ('Specialty', 'Gutter Installation', 'Seamless gutters, downspouts, and guards.', 2)
) as s(group_name, name, description, sort_order)
  on s.group_name = g.name;

insert into public.locations (name, slug, address, city, region, postal_code, phone, hours, intro, is_primary, sort_order) values
  ('Stuart Office', 'stuart-office', '1120 SE Federal Hwy', 'Stuart', 'FL', '34994', '(772) 555-0142',
   '[{"days":"Mon–Fri","hours":"7:30–17:00"},{"days":"Sat","hours":"By appointment"}]',
   'Our home base on the Treasure Coast — crews dispatch from here daily.',
   true, 1);

insert into public.service_areas (name, slug, region, intro, body, faqs, sort_order) values
  ('Palm Beach', 'palm-beach', 'FL',
   'Tile roof specialists for Palm Beach''s older Mediterranean homes — we handle the county''s strict permitting and HOA architectural reviews as part of every job.',
   'Much of our Palm Beach work is clay and concrete tile on homes built between the 1960s and 1990s, where matching existing profiles matters as much as the waterproofing underneath. We keep relationships with the major tile suppliers so discontinued profiles can usually be matched from reclaimed stock.',
   '[{"question":"Do you handle HOA architectural approval?","answer":"Yes — we prepare the submittal package (profiles, colors, specs) for your HOA board as part of the contract."},{"question":"Can you match my existing tile?","answer":"Usually. We source reclaimed tile for discontinued profiles and will bring samples before any work starts."}]',
   1),
  ('Jupiter', 'jupiter', 'FL',
   'From Abacoa to the Inlet Colony, we re-roof more homes in Jupiter than anywhere else — most of them metal conversions built to take a hurricane season head-on.',
   'Jupiter homeowners increasingly ask for standing-seam metal when their shingle roof ages out, and it''s what we''d put on our own homes here: better wind ratings, lower insurance premiums, and a 40+ year service life in salt air.',
   '[{"question":"Is metal worth it near the coast?","answer":"Within a mile of salt water we recommend aluminum standing seam specifically — it outlasts steel in salt air and carries the same wind rating."},{"question":"Will a metal roof lower my insurance?","answer":"Often, yes. Florida insurers discount for FBC-approved metal systems with documented installation — we provide the paperwork."}]',
   2),
  ('Port St. Lucie', 'port-st-lucie', 'FL',
   'Fast-growing PSL means a lot of 2000s-era builder-grade shingle hitting end of life at once — we run two dedicated replacement crews out here year-round.',
   'If your neighbors are re-roofing, your roof is probably from the same builder batch. We offer street-level scheduling in PSL: multiple homes on one block share mobilization costs, which shows up as a real discount on each contract.',
   '[{"question":"My neighbors are re-roofing — do you offer group pricing?","answer":"Yes. Two or more homes on the same street scheduled together each save on mobilization — ask for the street rate."}]',
   3),
  ('Fort Pierce', 'fort-pierce', 'FL',
   'Storm response is most of what we do in Fort Pierce — free inspections with photo documentation your insurance adjuster will actually accept.',
   'After a named storm we prioritize Fort Pierce inspections within 48 hours. Our reports use the carrier-standard format (per-slope photos, test squares, moisture readings), which is the difference between a smooth claim and a fight.',
   '[{"question":"Do you work directly with insurance?","answer":"We document to carrier standards and meet your adjuster on site, but you stay in control of your claim — we never take assignment of benefits."}]',
   4),
  ('Stuart', 'stuart', 'FL',
   'Our home town — same-week repair scheduling, and the only crew in Martin County we let put our name on a yard sign.',
   null,
   '[{"question":"How fast can you fix a leak in Stuart?","answer":"Repairs in Stuart are usually scheduled within the week; active leaks get tarped within 24 hours."}]',
   5);

-- Spanish translations for the demo content (see docs/i18n.md). Records are
-- matched on the English source value (or slug for service areas, whose intros
-- are long and quote-heavy). Safe to re-run: upserts by unique key.

insert into public.translations (entity, entity_id, locale, field, value)
select 'service_groups', g.id, 'es', 'name', t.es
from public.service_groups g
join (values
  ('Residential Roofing', 'Techado residencial'),
  ('Specialty', 'Especialidad')
) as t(en, es) on g.name = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'services', s.id, 'es', 'name', t.es
from public.services s
join (values
  ('Roof Replacement', 'Reemplazo de techo'),
  ('Roof Repair', 'Reparación de techo'),
  ('Storm Damage Inspection', 'Inspección por daños de tormenta'),
  ('Metal Roofing', 'Techos de metal'),
  ('Gutter Installation', 'Instalación de canaletas')
) as t(en, es) on s.name = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'services', s.id, 'es', 'description', t.es
from public.services s
join (values
  ('Full tear-off and replacement, shingle or tile.', 'Retiro completo y reemplazo, de tejas o teja.'),
  ('Leaks, missing shingles, flashing, soffit and fascia.', 'Goteras, tejas faltantes, tapajuntas, sofito y fascia.'),
  ('Free inspection with insurance-claim documentation.', 'Inspección gratuita con documentación para el reclamo al seguro.'),
  ('Standing seam and 5V metal systems.', 'Sistemas de metal de junta alzada y 5V.'),
  ('Seamless gutters, downspouts, and guards.', 'Canaletas sin costuras, bajantes y protectores.')
) as t(en, es) on s.description = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'locations', l.id, 'es', 'intro', t.es
from public.locations l
join (values
  ('Our home base on the Treasure Coast — crews dispatch from here daily.', 'Nuestra base en la Treasure Coast: las cuadrillas salen de aquí todos los días.')
) as t(en, es) on l.intro = t.en
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'service_areas', a.id, 'es', 'intro', t.es
from public.service_areas a
join (values
  ('palm-beach', 'Especialistas en techos de teja para las casas mediterráneas más antiguas de Palm Beach: gestionamos los estrictos permisos del condado y las revisiones arquitectónicas de la HOA como parte de cada trabajo.'),
  ('jupiter', 'Desde Abacoa hasta Inlet Colony, cambiamos el techo de más casas en Jupiter que en ningún otro lugar, y la mayoría son conversiones a metal preparadas para enfrentar la temporada de huracanes.'),
  ('port-st-lucie', 'El rápido crecimiento de PSL significa que mucha teja asfáltica de calidad básica de los años 2000 llega al final de su vida al mismo tiempo; tenemos dos cuadrillas de reemplazo dedicadas aquí todo el año.'),
  ('fort-pierce', 'La respuesta ante tormentas es la mayor parte de lo que hacemos en Fort Pierce: inspecciones gratuitas con documentación fotográfica que tu ajustador de seguros sí aceptará.'),
  ('stuart', 'Nuestro pueblo natal: reparaciones programadas la misma semana, y la única cuadrilla en el condado de Martin a la que dejamos poner nuestro nombre en un letrero de jardín.')
) as t(slug, es) on a.slug = t.slug
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'service_areas', a.id, 'es', 'body', t.es
from public.service_areas a
join (values
  ('palm-beach', 'Gran parte de nuestro trabajo en Palm Beach es teja de barro y concreto en casas construidas entre los años 1960 y 1990, donde igualar los perfiles existentes importa tanto como la impermeabilización debajo. Mantenemos relaciones con los principales proveedores de teja para poder igualar perfiles descontinuados con material recuperado.'),
  ('jupiter', 'Los propietarios de Jupiter piden cada vez más metal de junta alzada cuando su techo de tejas llega al final de su vida, y es lo que pondríamos en nuestras propias casas aquí: mejor resistencia al viento, primas de seguro más bajas y una vida útil de más de 40 años en aire salino.'),
  ('port-st-lucie', 'Si tus vecinos están cambiando el techo, el tuyo probablemente sea del mismo lote del constructor. Ofrecemos programación a nivel de calle en PSL: varias casas en una cuadra comparten los costos de movilización, lo que se refleja como un descuento real en cada contrato.'),
  ('fort-pierce', 'Después de una tormenta con nombre, priorizamos las inspecciones de Fort Pierce en un plazo de 48 horas. Nuestros informes usan el formato estándar de la aseguradora (fotos por pendiente, cuadros de prueba, lecturas de humedad), que es la diferencia entre un reclamo sin problemas y una disputa.')
) as t(slug, es) on a.slug = t.slug
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;

insert into public.translations (entity, entity_id, locale, field, value)
select 'service_areas', a.id, 'es', 'faqs', t.es
from public.service_areas a
join (values
  ('palm-beach', '[{"question":"¿Gestionan la aprobación arquitectónica de la HOA?","answer":"Sí: preparamos el paquete de presentación (perfiles, colores, especificaciones) para la junta de tu HOA como parte del contrato."},{"question":"¿Pueden igualar mi teja actual?","answer":"Normalmente sí. Conseguimos teja recuperada para perfiles descontinuados y llevamos muestras antes de comenzar."}]'),
  ('jupiter', '[{"question":"¿Vale la pena el metal cerca de la costa?","answer":"A menos de un kilómetro del agua salada recomendamos junta alzada de aluminio específicamente: dura más que el acero en aire salino y tiene la misma resistencia al viento."},{"question":"¿Un techo de metal bajará mi seguro?","answer":"A menudo sí. Las aseguradoras de Florida ofrecen descuentos por sistemas de metal aprobados por el FBC con instalación documentada; nosotros entregamos el papeleo."}]'),
  ('port-st-lucie', '[{"question":"Mis vecinos están cambiando el techo, ¿ofrecen precio grupal?","answer":"Sí. Dos o más casas en la misma calle programadas juntas ahorran en movilización; pregunta por la tarifa de calle."}]'),
  ('fort-pierce', '[{"question":"¿Trabajan directamente con el seguro?","answer":"Documentamos según los estándares de la aseguradora y nos reunimos con tu ajustador en el sitio, pero tú mantienes el control de tu reclamo; nunca aceptamos cesión de beneficios."}]'),
  ('stuart', '[{"question":"¿Qué tan rápido pueden reparar una gotera en Stuart?","answer":"Las reparaciones en Stuart suelen programarse dentro de la semana; las goteras activas se cubren con lona en 24 horas."}]')
) as t(slug, es) on a.slug = t.slug
on conflict (entity, entity_id, locale, field) do update set value = excluded.value;
