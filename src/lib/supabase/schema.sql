-- ───────────────────────────────────────────────────────────
-- Naronai — Supabase Database Schema (Core Shopping)
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- ───────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- ── Admin helper ──────────────────────────────────────────
-- Table first, then function (references the table),
-- then policy (references the function).

create table admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'editor'
               check (role in ('superadmin','editor')),
  created_at timestamptz default now()
);

alter table admins enable row level security;

-- SECURITY DEFINER bypasses RLS when reading admins table.
-- set search_path prevents search-path injection.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.admins
    where user_id = (select auth.uid())
  )
$$;

create policy "admins_read"
  on admins for select
  to authenticated
  using (is_admin());

-- ── Products ──────────────────────────────────────────────
create table products (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name        text not null,
  description text,
  price       integer not null,         -- kobo (NGN × 100)
  images      text[] default '{}',
  tier        text check (tier in ('Signature','Couture','Bespoke')),
  in_stock    boolean default true,
  stock_count integer not null default 0,
  is_new      boolean default false,
  hair_type   text,
  length      text,
  density     text,
  cap_type    text,
  origin      text,
  category    text,
  colors      jsonb default '[]',       -- [{name, hex, image?}]
  lengths     text[] default '{}',
  created_at  timestamptz default now()
);

alter table products enable row level security;

create policy "products_public_read"
  on products for select
  using (true);

create policy "products_admin_write"
  on products for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ── Orders ────────────────────────────────────────────────
create table orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references auth.users(id) on delete set null,
  guest_email      text,
  items            jsonb not null,
  subtotal         integer not null,    -- kobo
  shipping_fee     integer default 0,
  total            integer not null,    -- kobo
  status           text not null default 'pending'
                     check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  paystack_ref     text unique,
  shipping_address jsonb not null,
  notes            text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table orders enable row level security;

-- Authenticated users see only their own orders
create policy "orders_owner_read"
  on orders for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Guests and logged-in users can place orders
create policy "orders_insert_open"
  on orders for insert
  with check (true);

-- Admins can read all orders and update status
create policy "orders_admin_all"
  on orders for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ── User Profiles ─────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  first_name  text,
  last_name   text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz default now()
);

alter table profiles enable row level security;

create policy "profiles_owner_read"
  on profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_owner_update"
  on profiles for update
  to authenticated
  using  ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "profiles_admin_read"
  on profiles for select
  to authenticated
  using (is_admin());

-- Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Wishlist ──────────────────────────────────────────────
create table wishlist_items (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

alter table wishlist_items enable row level security;

create policy "wishlist_owner_all"
  on wishlist_items for all
  to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── Newsletter Subscribers ────────────────────────────────
create table newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  first_name text,
  status     text not null default 'active'
               check (status in ('active','unsubscribed')),
  source     text default 'site',   -- 'site' | 'checkout'
  created_at timestamptz default now()
);

alter table newsletter_subscribers enable row level security;

create policy "newsletter_insert_open"
  on newsletter_subscribers for insert
  with check (true);

create policy "newsletter_admin_all"
  on newsletter_subscribers for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ── Stock management ─────────────────────────────────────
-- Migration: run this if products table already exists
-- alter table products add column if not exists stock_count integer not null default 0;

-- Atomic decrement that auto-flips in_stock=false when count hits 0.
-- A single UPDATE is serialised by Postgres, so two concurrent calls
-- racing for the last unit both hit the WHERE check; only one wins.
create or replace function public.decrement_stock(p_id uuid, p_qty integer default 1)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  update public.products
  set
    stock_count = stock_count - p_qty,
    in_stock    = (stock_count - p_qty > 0)
  where id = p_id
    and in_stock    = true
    and stock_count >= p_qty
  returning jsonb_build_object(
    'success',   true,
    'remaining', stock_count
  ) into result;

  if result is null then
    result := jsonb_build_object('success', false, 'remaining', 0);
  end if;

  return result;
end;
$$;

-- ── Indexes ───────────────────────────────────────────────
create index idx_products_slug       on products(slug);
create index idx_products_category   on products(category);
create index idx_products_tier       on products(tier);
create index idx_orders_user         on orders(user_id);
create index idx_orders_paystack_ref on orders(paystack_ref);
create index idx_orders_status       on orders(status);
create index idx_wishlist_user       on wishlist_items(user_id);
create index idx_newsletter_email    on newsletter_subscribers(email);
