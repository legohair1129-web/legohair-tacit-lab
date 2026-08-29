-- Adds fields needed for admin-driven staff onboarding (LEGOHAIR TACIT LAB).
-- No changes to existing columns, RLS policies, or triggers — new nullable
-- columns plus a defaulted status column only.

alter table public.profiles
  add column email text,
  add column employee_number text,
  add column joined_at date,
  add column notes text,
  add column status text not null default 'active' check (status in ('active', 'inactive'));
