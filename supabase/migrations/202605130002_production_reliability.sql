alter table public.checkout_sessions
  add column if not exists finalized_at timestamptz,
  add column if not exists finalization_error text;

alter table public.payments
  add column if not exists idempotency_key text,
  add column if not exists attempt_count integer not null default 0 check (attempt_count >= 0),
  add column if not exists last_error text;

alter table public.phonepe_webhook_events
  add column if not exists retry_count integer not null default 0 check (retry_count >= 0),
  add column if not exists next_retry_at timestamptz,
  add column if not exists locked_at timestamptz;

alter table public.shipments
  add column if not exists retry_count integer not null default 0 check (retry_count >= 0),
  add column if not exists failure_reason text,
  add column if not exists next_retry_at timestamptz,
  add column if not exists last_sync_attempt_at timestamptz;

do $$
begin
  alter table public.shipments drop constraint if exists shipments_status_check;
  alter table public.shipments add constraint shipments_status_check
    check (status in ('pending', 'synced', 'awb_assigned', 'pickup_scheduled', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'cancelled'));
end $$;

create unique index if not exists orders_checkout_session_unique_idx
on public.orders (checkout_session_id)
where checkout_session_id is not null;

create unique index if not exists order_items_order_product_variant_unique_idx
on public.order_items (order_id, product_id, variant_label)
where product_id is not null;

create unique index if not exists payments_idempotency_key_unique_idx
on public.payments (idempotency_key)
where idempotency_key is not null;

create table if not exists public.order_timeline_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  label text not null,
  description text,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (order_id, status)
);

create index if not exists order_timeline_events_order_idx
on public.order_timeline_events (order_id, occurred_at asc);

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  dedupe_key text not null unique,
  recipient text not null,
  subject text not null,
  status text not null default 'queued'
    check (status in ('queued', 'sending', 'sent', 'failed', 'skipped')),
  attempts integer not null default 0 check (attempts >= 0),
  provider text not null default 'resend',
  provider_message_id text,
  payload jsonb not null default '{}'::jsonb,
  last_error text,
  next_retry_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists email_events_status_retry_idx
on public.email_events (status, next_retry_at, created_at);

create trigger email_events_set_updated_at
before update on public.email_events
for each row execute function public.set_updated_at();

alter table public.order_timeline_events enable row level security;
alter table public.email_events enable row level security;

create policy "Users can read their order timeline"
on public.order_timeline_events for select
to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = order_timeline_events.order_id
      and orders.user_id = auth.uid()
  )
);

create policy "Admins can read all order timeline"
on public.order_timeline_events for select
to authenticated
using (public.is_admin());

create policy "Admins can manage order timeline"
on public.order_timeline_events for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read email events"
on public.email_events for select
to authenticated
using (public.is_admin());

create or replace function public.add_order_timeline_event(
  p_order_id uuid,
  p_status text,
  p_label text,
  p_description text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_occurred_at timestamptz default now()
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id uuid;
begin
  insert into public.order_timeline_events (
    order_id,
    status,
    label,
    description,
    metadata,
    occurred_at
  )
  values (
    p_order_id,
    p_status,
    p_label,
    p_description,
    coalesce(p_metadata, '{}'::jsonb),
    coalesce(p_occurred_at, now())
  )
  on conflict (order_id, status) do update set
    label = excluded.label,
    description = coalesce(excluded.description, public.order_timeline_events.description),
    metadata = public.order_timeline_events.metadata || excluded.metadata,
    occurred_at = least(public.order_timeline_events.occurred_at, excluded.occurred_at)
  returning id into v_event_id;

  return v_event_id;
end;
$$;

create or replace function public.create_order_number()
returns text
language sql
as $$
  select 'SAT-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
$$;

create or replace function public.finalize_paid_checkout_session(
  p_checkout_session_id uuid,
  p_merchant_order_id text,
  p_source text default 'payment_verification'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.checkout_sessions%rowtype;
  v_order public.orders%rowtype;
  v_item record;
  v_updated_product_id uuid;
begin
  select *
  into v_session
  from public.checkout_sessions
  where id = p_checkout_session_id
  for update;

  if not found then
    raise exception 'Checkout session not found.';
  end if;

  if v_session.converted_order_id is not null then
    return v_session.converted_order_id;
  end if;

  if v_session.status not in ('paid', 'payment_pending') then
    raise exception 'Checkout session is not ready to finalize.';
  end if;

  for v_item in
    select *
    from public.checkout_session_items
    where checkout_session_id = v_session.id
    order by product_id
  loop
    update public.products
    set stock_quantity = stock_quantity - v_item.quantity
    where id = v_item.product_id
      and is_active = true
      and stock_quantity >= v_item.quantity
    returning id into v_updated_product_id;

    if v_updated_product_id is null then
      update public.checkout_sessions
      set finalization_error = 'Insufficient stock for ' || v_item.product_name
      where id = v_session.id;

      raise exception 'Insufficient stock for %.', v_item.product_name;
    end if;
  end loop;

  insert into public.orders (
    order_number,
    user_id,
    checkout_session_id,
    shipping_address_id,
    billing_address_id,
    customer_email,
    customer_phone,
    status,
    payment_status,
    subtotal,
    shipping_amount,
    tax_amount,
    discount_amount,
    total_amount,
    currency,
    delivery_method,
    billing_same_as_shipping,
    shiprocket_courier_id,
    shiprocket_courier_name,
    estimated_delivery_date,
    metadata
  )
  values (
    public.create_order_number(),
    v_session.user_id,
    v_session.id,
    v_session.shipping_address_id,
    v_session.billing_address_id,
    v_session.customer_email,
    v_session.customer_phone,
    'processing',
    'paid',
    v_session.subtotal,
    v_session.shipping_amount,
    v_session.tax_amount,
    v_session.discount_amount,
    v_session.total_amount,
    v_session.currency,
    v_session.shipping_method,
    v_session.billing_same_as_shipping,
    v_session.shiprocket_courier_id,
    v_session.shiprocket_courier_name,
    v_session.estimated_delivery_date,
    jsonb_build_object(
      'checkoutSessionId', v_session.id,
      'merchantOrderId', p_merchant_order_id,
      'source', p_source
    )
  )
  returning * into v_order;

  insert into public.order_items (
    order_id,
    product_id,
    product_name,
    product_slug,
    variant_label,
    quantity,
    unit_price,
    line_total,
    image_url
  )
  select
    v_order.id,
    product_id,
    product_name,
    product_slug,
    variant_label,
    quantity,
    unit_price,
    line_total,
    image_url
  from public.checkout_session_items
  where checkout_session_id = v_session.id;

  update public.payments
  set order_id = v_order.id
  where merchant_order_id = p_merchant_order_id
    and checkout_session_id = v_session.id;

  update public.checkout_sessions
  set
    status = 'converted',
    converted_order_id = v_order.id,
    finalized_at = now(),
    finalization_error = null
  where id = v_session.id;

  perform public.add_order_timeline_event(v_order.id, 'order_placed', 'Order Placed', 'Your order was created after payment confirmation.');
  perform public.add_order_timeline_event(v_order.id, 'payment_confirmed', 'Payment Confirmed', 'Payment was verified successfully.');
  perform public.add_order_timeline_event(v_order.id, 'packed', 'Packed', 'Your order is being prepared for shipment.');

  return v_order.id;
exception
  when unique_violation then
    select *
    into v_order
    from public.orders
    where checkout_session_id = p_checkout_session_id;

    if v_order.id is not null then
      return v_order.id;
    end if;

    raise;
end;
$$;
