-- Demo content: restaurant archetype.
-- Run after switching config/client.ts to the restaurant module.
-- Safe to re-run: deletes its own demo rows first.

delete from public.services where name in ('Crispy Brussels', 'Burrata & Peach', 'Half Chicken', 'Hanger Steak', 'Mushroom Risotto', 'Basque Cheesecake');
delete from public.service_groups where name in ('Starters', 'Mains', 'Dessert');
delete from public.locations where name = 'The Corner Table';
delete from public.promotions where title in ('Live Jazz Fridays', 'Happy Hour 4–6');

with groups as (
  insert into public.service_groups (name, description, sort_order) values
    ('Starters', null, 1),
    ('Mains', 'Served with seasonal sides.', 2),
    ('Dessert', null, 3)
  returning id, name
)
insert into public.services (group_id, name, description, price, sort_order)
select g.id, s.name, s.description, s.price, s.sort_order
from groups g
join (values
  ('Starters', 'Crispy Brussels', 'Chili crisp, lime, peanuts.', 1400, 1),
  ('Starters', 'Burrata & Peach', 'Basil, aged balsamic, grilled bread.', 1700, 2),
  ('Mains', 'Half Chicken', 'Wood-fired, salsa verde.', 2800, 1),
  ('Mains', 'Hanger Steak', 'Chimichurri, crispy potatoes.', 3400, 2),
  ('Mains', 'Mushroom Risotto', 'Local mushrooms, parmesan, thyme.', 2600, 3),
  ('Dessert', 'Basque Cheesecake', 'Burnt top, cold center.', 1200, 1)
) as s(group_name, name, description, price, sort_order)
  on s.group_name = g.name;

insert into public.locations (name, slug, address, city, region, postal_code, phone, hours, intro, latitude, longitude, is_primary, sort_order) values
  ('The Corner Table', 'the-corner-table', '89 River Rd', 'Austin', 'TX', '78702', '(512) 555-0189',
   '[{"days":"Tue–Thu","hours":"17:00–22:00"},{"days":"Fri–Sat","hours":"17:00–23:00"},{"days":"Sun","hours":"11:00–15:00"}]',
   'Seasonal, wood-fired cooking on the east side. Reservations recommended on weekends.',
   30.2607, -97.7203, true, 1);

insert into public.promotions (title, body, badge, sort_order) values
  ('Live Jazz Fridays', 'The Marcus Reed Trio, every Friday from 8pm. No cover.', 'Weekly', 1),
  ('Happy Hour 4–6', 'Half-price starters and $8 house cocktails at the bar, Tuesday–Friday.', 'Daily', 2);
