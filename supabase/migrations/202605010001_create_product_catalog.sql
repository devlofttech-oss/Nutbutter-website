create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  sku text not null unique,
  slug text not null unique,
  name text not null,
  subtitle text,
  description text not null,
  ingredients text[] not null default '{}',
  nutrition jsonb not null default '{}'::jsonb,
  image_url text not null,
  gallery_urls text[] not null default '{}',
  price numeric(10, 2) not null check (price >= 0),
  sale_price numeric(10, 2) check (sale_price is null or sale_price >= 0),
  currency char(3) not null default 'INR',
  weight_grams integer check (weight_grams is null or weight_grams > 0),
  variants jsonb not null default '[]'::jsonb,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  badge text,
  badge_style text,
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  reviews_count integer not null default 0 check (reviews_count >= 0),
  search_keywords text[] not null default '{}',
  seo_title text,
  seo_description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text,
  title text,
  body text not null,
  rating integer not null check (rating between 1 and 5),
  is_verified_purchase boolean not null default false,
  is_published boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_active_sort_idx on public.categories (is_active, sort_order);
create index if not exists products_active_featured_idx on public.products (is_active, is_featured, created_at desc);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_price_idx on public.products (price);
create index if not exists products_name_trgm_idx on public.products using gin (name gin_trgm_ops);
create index if not exists reviews_product_published_idx on public.reviews (product_id, is_published);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger reviews_set_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

create or replace function public.refresh_product_review_stats()
returns trigger
language plpgsql
as $$
declare
  affected_product_id uuid;
begin
  affected_product_id = coalesce(new.product_id, old.product_id);

  update public.products
  set
    rating = coalesce((
      select round(avg(rating)::numeric, 1)
      from public.reviews
      where product_id = affected_product_id
        and is_published = true
    ), 0),
    reviews_count = (
      select count(*)::integer
      from public.reviews
      where product_id = affected_product_id
        and is_published = true
    )
  where id = affected_product_id;

  return coalesce(new, old);
end;
$$;

create trigger reviews_refresh_product_stats
after insert or update or delete on public.reviews
for each row execute function public.refresh_product_review_stats();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;

create policy "Public can read active categories"
on public.categories for select
using (is_active = true);

create policy "Public can read active products"
on public.products for select
using (is_active = true);

create policy "Public can read published reviews"
on public.reviews for select
using (is_published = true);

create policy "Authenticated users can create reviews"
on public.reviews for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own unpublished reviews"
on public.reviews for update
to authenticated
using (auth.uid() = user_id and is_published = false)
with check (auth.uid() = user_id and is_published = false);
