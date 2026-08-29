-- LEGOHAIR TACIT LAB Ver.1 — initial schema
-- Philosophy: record noticing/intuition/judgement/forecast, never customer PII.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'staff' check (role in ('staff', 'admin')),
  display_name text,
  store text,
  position text,
  stylist_years int,
  research_group text check (research_group in ('top_stylist', 'stylist', 'junior_stylist')),
  created_at timestamptz not null default now()
);

-- security-definer helper so RLS policies can check admin status
-- without recursively re-evaluating profiles' own RLS (infinite recursion).
create function public.is_admin(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p where p.id = uid and p.role = 'admin'
  );
$$;

-- auto-create a profile row when a new auth user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- staff may edit their own basic info, but never their own role/research_group
create function public.prevent_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() is null for service_role/direct-SQL access (e.g. bootstrapping
  -- the first admin from the SQL editor), which is already trusted to bypass
  -- RLS; only block a signed-in non-admin from elevating themselves.
  if auth.uid() is not null and not public.is_admin(auth.uid()) then
    if new.role is distinct from old.role
       or new.research_group is distinct from old.research_group then
      raise exception 'only an admin can change role or research_group';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_privilege_escalation
  before update on public.profiles
  for each row execute function public.prevent_privilege_escalation();

alter table public.profiles enable row level security;

create policy profiles_select on public.profiles
  for select using (auth.uid() = id or public.is_admin(auth.uid()));

create policy profiles_update on public.profiles
  for update using (auth.uid() = id or public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- customers (anonymous customer_key — no name/phone/address/email/DOB, ever)
-- ---------------------------------------------------------------------------
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles (id),
  store text,
  age_group text,
  created_at timestamptz not null default now()
);

create index customers_created_by_idx on public.customers (created_by);

alter table public.customers enable row level security;

create policy customers_select on public.customers
  for select using (created_by = auth.uid() or public.is_admin(auth.uid()));

create policy customers_insert on public.customers
  for insert with check (created_by = auth.uid());

create policy customers_update on public.customers
  for update using (created_by = auth.uid() or public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- cases — one row per visit record (CUSTOMER..BEST BEFORE)
-- ---------------------------------------------------------------------------
create table public.cases (
  id uuid primary key default gen_random_uuid(),
  customer_key uuid not null references public.customers (id),
  staff_id uuid not null references public.profiles (id),
  previous_case_id uuid references public.cases (id),

  -- CUSTOMER
  store text,
  age_group text,
  visit_type text check (visit_type in ('new', 'existing')),
  visit_cycle text,
  menu text,
  relationship_level text check (relationship_level in ('R0', 'R1', 'R2', 'R3', 'R4')),

  -- CUSTOMER STATE / BEAUTY NEED / ISSUE
  state text check (
    state in ('KEEP', 'CHANGE', 'FEAR', 'LOST', 'IDEAL', 'PROBLEM', 'TRUST', 'TRANSITION')
  ),
  state_note text,
  beauty_needs text[] not null default '{}',
  issues text[] not null default '{}',

  -- MEMORY
  memory_note text,

  -- NOTICE
  notice_items text[] not null default '{}',
  notice_note text,

  -- INTUITION (recorded before reasoning) / INTUITION CUE (recorded after)
  intuition_text text,
  intuition_cue_items text[] not null default '{}',
  intuition_cue_note text,

  -- DISCOVER
  discover_asked text,
  discover_found text,
  discover_customer_wish text,
  discover_real_issue text,
  discover_alignment text check (
    discover_alignment in ('same', 'slightly_different', 'very_different', 'unknown')
  ),

  -- DECISION
  decision_options jsonb not null default '[]',
  decision_final text,
  decision_reason text,
  decision_not_chosen text,
  decision_not_chosen_reason text,

  -- FORECAST
  forecast_hair_state text,
  forecast_feeling text,
  forecast_next_style text,
  forecast_next_treatment text,
  forecast_next_visit_timing text,
  forecast_success_state text,

  -- BEST BEFORE
  best_before_items text[] not null default '{}',
  best_before_actions text[] not null default '{}',
  best_before_note text,

  -- sharing / pickup
  is_shared boolean not null default false,
  is_pickup boolean not null default false,
  pickup_comment text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cases_staff_id_idx on public.cases (staff_id);
create index cases_customer_key_idx on public.cases (customer_key);
create index cases_is_shared_idx on public.cases (is_shared) where is_shared;
create index cases_is_pickup_idx on public.cases (is_pickup) where is_pickup;
create index cases_previous_case_id_idx on public.cases (previous_case_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cases_set_updated_at
  before update on public.cases
  for each row execute function public.set_updated_at();

alter table public.cases enable row level security;

create policy cases_select on public.cases
  for select using (
    staff_id = auth.uid() or is_shared or public.is_admin(auth.uid())
  );

create policy cases_insert on public.cases
  for insert with check (staff_id = auth.uid());

create policy cases_update on public.cases
  for update using (staff_id = auth.uid());

-- admin-only RPC so pickup curation never lets an admin edit a case's content
create function public.admin_set_pickup(
  p_case_id uuid,
  p_is_pickup boolean,
  p_pickup_comment text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'only an admin can set pickup';
  end if;

  update public.cases
  set is_pickup = p_is_pickup,
      pickup_comment = p_pickup_comment
  where id = p_case_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- case_reviews — 答え合わせ, always written by the case's own staff
-- ---------------------------------------------------------------------------
create table public.case_reviews (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id),
  reviewed_by uuid not null references public.profiles (id),

  forecast_accuracy text check (forecast_accuracy in ('hit', 'partial', 'miss', 'unknown')),
  before_connection text check (
    before_connection in (
      'very_connected', 'connected', 'neutral', 'little_connected', 'not_connected'
    )
  ),
  actual_result text,
  what_was_right text,
  what_was_missed text,
  new_notice text,
  next_watch_point text,
  learning text,

  created_at timestamptz not null default now()
);

create unique index case_reviews_case_id_key on public.case_reviews (case_id);
create index case_reviews_reviewed_by_idx on public.case_reviews (reviewed_by);

alter table public.case_reviews enable row level security;

create policy case_reviews_select on public.case_reviews
  for select using (
    reviewed_by = auth.uid()
    or public.is_admin(auth.uid())
    or exists (
      select 1 from public.cases c
      where c.id = case_reviews.case_id and c.is_shared
    )
  );

create policy case_reviews_insert on public.case_reviews
  for insert with check (
    reviewed_by = auth.uid()
    and exists (
      select 1 from public.cases c
      where c.id = case_id and c.staff_id = auth.uid()
    )
  );

create policy case_reviews_update on public.case_reviews
  for update using (reviewed_by = auth.uid());

-- ---------------------------------------------------------------------------
-- categories — admin-editable option lists (initially just ISSUE)
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  field_key text not null,
  value text not null,
  label text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (field_key, value)
);

alter table public.categories enable row level security;

create policy categories_select on public.categories
  for select using (auth.role() = 'authenticated');

create policy categories_insert on public.categories
  for insert with check (public.is_admin(auth.uid()));

create policy categories_update on public.categories
  for update using (public.is_admin(auth.uid()));

create policy categories_delete on public.categories
  for delete using (public.is_admin(auth.uid()));

insert into public.categories (field_key, value, label, sort_order) values
  ('issue', 'cut', 'カット', 10),
  ('issue', 'face_line', '顔周り', 20),
  ('issue', 'bangs', '前髪', 30),
  ('issue', 'short', 'ショート', 40),
  ('issue', 'length', '長さ', 50),
  ('issue', 'volume_amount', '毛量', 60),
  ('issue', 'texture_curl', 'クセ', 70),
  ('issue', 'frizz', '広がり', 80),
  ('issue', 'volume', 'ボリューム', 90),
  ('issue', 'gray_hair', '白髪', 100),
  ('issue', 'color', 'カラー', 110),
  ('issue', 'brightness', '明るさ', 120),
  ('issue', 'color_tone', '色味', 130),
  ('issue', 'damage', 'ダメージ', 140),
  ('issue', 'hair_quality', '髪質', 150),
  ('issue', 'scalp', '頭皮', 160),
  ('issue', 'styling', 'スタイリング', 170),
  ('issue', 'home_care', 'ホームケア', 180),
  ('issue', 'other', 'その他', 999);
