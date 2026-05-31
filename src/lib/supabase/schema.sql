-- ───────────────────────────────────────────────────────────
-- Naronai — Supabase Database Schema
-- Run this in the Supabase SQL editor to bootstrap the DB
-- ───────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Products ──────────────────────────────────────────────
create table products (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name        text not null,
  description text,
  price       integer not null,       -- stored in kobo (NGN smallest unit)
  images      text[] default '{}',
  tier        text check (tier in ('Signature','Couture','Bespoke')),
  in_stock    boolean default true,
  is_new      boolean default false,
  hair_type   text,
  length      text,
  density     text,
  cap_type    text,
  origin      text,
  category    text,
  colors      jsonb default '[]',    -- [{name, hex, image}]
  lengths     text[] default '{}',
  created_at  timestamptz default now()
);

-- Public read access for products
alter table products enable row level security;
create policy "Products are publicly readable"
  on products for select using (true);
create policy "Only admins can modify products"
  on products for all using (auth.role() = 'service_role');

-- ── Orders ────────────────────────────────────────────────
create table orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references auth.users(id) on delete set null,
  guest_email      text,
  items            jsonb not null,
  subtotal         integer not null,   -- kobo
  shipping_fee     integer default 0,
  total            integer not null,   -- kobo
  status           text not null default 'pending'
                   check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  paystack_ref     text unique,
  shipping_address jsonb not null,
  notes            text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table orders enable row level security;
create policy "Users can read their own orders"
  on orders for select using (auth.uid() = user_id);
create policy "Anyone can create an order"
  on orders for insert with check (true);
create policy "Only admins can update orders"
  on orders for update using (auth.role() = 'service_role');

-- ── User Profiles ─────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  first_name  text,
  last_name   text,
  phone       text,
  created_at  timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can read their own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Wishlist ──────────────────────────────────────────────
create table wishlist_items (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

alter table wishlist_items enable row level security;
create policy "Users manage their own wishlist"
  on wishlist_items for all using (auth.uid() = user_id);

-- ── Consultation Bookings ─────────────────────────────────
create table consultations (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  email          text not null,
  phone          text not null,
  instagram      text,
  hair_situation text,
  desired_style  text,
  budget_range   text,
  occasion       text,
  preferred_date date,
  preferred_time text,
  notes          text,
  status         text default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at     timestamptz default now()
);

alter table consultations enable row level security;
create policy "Anyone can create a consultation"
  on consultations for insert with check (true);
create policy "Only admins can read consultations"
  on consultations for select using (auth.role() = 'service_role');

-- ── Indexes ───────────────────────────────────────────────
create index idx_products_slug     on products(slug);
create index idx_products_category on products(category);
create index idx_orders_user       on orders(user_id);
create index idx_orders_paystack   on orders(paystack_ref);
create index idx_orders_status     on orders(status);
