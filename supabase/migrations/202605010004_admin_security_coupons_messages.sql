create table if not exists public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'manager')),
  created_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percent', 'flat')),
  discount_value numeric(10, 2) not null check (discount_value > 0),
  expires_at timestamptz,
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  used_count integer not null default 0 check (used_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_roles_user_idx on public.admin_roles (user_id);
create index if not exists contact_messages_status_idx on public.contact_messages (status, created_at desc);
create index if not exists coupons_code_idx on public.coupons (code);

create trigger coupons_set_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_roles
    where user_id = check_user_id
      and role in ('admin', 'manager')
  );
$$;

do $$
begin
  alter table public.orders drop constraint if exists orders_status_check;
  alter table public.orders add constraint orders_status_check
    check (status in ('pending_payment', 'paid', 'payment_failed', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'fulfilled', 'refunded'));
end $$;

alter table public.admin_roles enable row level security;
alter table public.contact_messages enable row level security;
alter table public.coupons enable row level security;

create policy "Admins can read admin roles"
on public.admin_roles for select
to authenticated
using (public.is_admin());

create policy "Admins can manage admin roles"
on public.admin_roles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Anyone can create contact messages"
on public.contact_messages for insert
with check (true);

create policy "Admins can read contact messages"
on public.contact_messages for select
to authenticated
using (public.is_admin());

create policy "Admins can update contact messages"
on public.contact_messages for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage coupons"
on public.coupons for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read all profiles"
on public.profiles for select
to authenticated
using (public.is_admin());

create policy "Admins can manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage categories"
on public.categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read all orders"
on public.orders for select
to authenticated
using (public.is_admin());

create policy "Admins can update all orders"
on public.orders for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read all order items"
on public.order_items for select
to authenticated
using (public.is_admin());

create policy "Admins can read all payments"
on public.payments for select
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

create policy "Public can read product images"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "Admins can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

