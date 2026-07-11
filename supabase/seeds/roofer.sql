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
