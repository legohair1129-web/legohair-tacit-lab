-- CASE input UX simplification (13 steps -> 4 phases).
-- Additive only: no existing column is dropped, renamed, or retyped, so
-- historical cases keep displaying exactly as before. New cases populate
-- these plus a handful of reused existing columns (see app code).

alter table public.cases
  add column discoveries text[] not null default '{}',
  add column customer_priority text,
  add column decision_categories text[] not null default '{}',
  add column menu_items text[] not null default '{}';
