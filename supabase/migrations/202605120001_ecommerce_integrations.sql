create table if not exists public.checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  shipping_address_id uuid references public.addresses(id) on delete set null,
  billing_address_id uuid references public.addresses(id) on delete set null,
  customer_email text not null,
  customer_phone text not null,
  status text not null default 'draft'
    check (status in ('draft', 'payment_pending', 'paid', 'payment_failed', 'converted', 'expired', 'cancelled')),
  payment_method text not null default 'phonepe',
  shipping_method text not null default 'shiprocket',
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  shipping_amount numeric(10, 2) not null default 0 check (shipping_amount >= 0),
  tax_amount numeric(10, 2) not null default 0 check (tax_amount >= 0),
  discount_amount numeric(10, 2) not null default 0 check (discount_amount >= 0),
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  currency char(3) not null default 'INR',
  billing_same_as_shipping boolean not null default true,
  shiprocket_courier_id integer,
  shiprocket_courier_name text,
  cod_available boolean not null default false,
  estimated_delivery_days integer,
  estimated_delivery_date date,
  shipping_quote jsonb not null default '{}'::jsonb,
  converted_order_id uuid references public.orders(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null default now() + interval '30 minutes',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checkout_session_items (
  id uuid primary key default gen_random_uuid(),
  checkout_session_id uuid not null references public.checkout_sessions(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  sku text,
  variant_label text not null default '250g',
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  line_total numeric(10, 2) not null check (line_total >= 0),
  image_url text,
  weight_grams integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'shiprocket',
  status text not null default 'pending'
    check (status in ('pending', 'synced', 'awb_assigned', 'pickup_scheduled', 'in_transit', 'delivered', 'failed', 'cancelled')),
  shiprocket_order_id text,
  shiprocket_shipment_id text,
  courier_company_id integer,
  courier_name text,
  awb_code text,
  tracking_url text,
  estimated_delivery_date date,
  freight_charge numeric(10, 2),
  raw_request jsonb not null default '{}'::jsonb,
  raw_response jsonb not null default '{}'::jsonb,
  tracking_response jsonb not null default '{}'::jsonb,
  synced_at timestamptz,
  awb_assigned_at timestamptz,
  last_tracked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id)
);

alter table public.payments
  alter column order_id drop not null;

alter table public.payments
  add column if not exists checkout_session_id uuid references public.checkout_sessions(id) on delete set null,
  add column if not exists provider_transaction_id text,
  add column if not exists provider_state text,
  add column if not exists failure_reason text;

alter table public.orders
  add column if not exists checkout_session_id uuid references public.checkout_sessions(id) on delete set null,
  add column if not exists shiprocket_courier_id integer,
  add column if not exists shiprocket_courier_name text,
  add column if not exists estimated_delivery_date date;

do $$
begin
  alter table public.orders drop constraint if exists orders_status_check;
  alter table public.orders add constraint orders_status_check
    check (status in ('pending_payment', 'paid', 'payment_failed', 'pending', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'fulfilled', 'refunded'));
end $$;

create index if not exists checkout_sessions_user_idx on public.checkout_sessions (user_id, created_at desc);
create index if not exists checkout_sessions_status_idx on public.checkout_sessions (status, created_at desc);
create index if not exists checkout_session_items_session_idx on public.checkout_session_items (checkout_session_id);
create index if not exists payments_checkout_session_idx on public.payments (checkout_session_id);
create index if not exists shipments_order_idx on public.shipments (order_id);
create index if not exists shipments_awb_idx on public.shipments (awb_code);
create index if not exists shipments_status_idx on public.shipments (status, created_at desc);

create trigger checkout_sessions_set_updated_at
before update on public.checkout_sessions
for each row execute function public.set_updated_at();

create trigger shipments_set_updated_at
before update on public.shipments
for each row execute function public.set_updated_at();

alter table public.checkout_sessions enable row level security;
alter table public.checkout_session_items enable row level security;
alter table public.shipments enable row level security;

create policy "Users can read their checkout sessions"
on public.checkout_sessions for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can read their checkout session items"
on public.checkout_session_items for select
to authenticated
using (
  exists (
    select 1 from public.checkout_sessions
    where checkout_sessions.id = checkout_session_items.checkout_session_id
      and checkout_sessions.user_id = auth.uid()
  )
);

create policy "Users can read their shipments"
on public.shipments for select
to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = shipments.order_id
      and orders.user_id = auth.uid()
  )
);

create policy "Admins can read checkout sessions"
on public.checkout_sessions for select
to authenticated
using (public.is_admin());

create policy "Admins can read checkout session items"
on public.checkout_session_items for select
to authenticated
using (public.is_admin());

create policy "Admins can read shipments"
on public.shipments for select
to authenticated
using (public.is_admin());

drop policy if exists "Users can create their orders" on public.orders;
drop policy if exists "Users can create their order items" on public.order_items;
