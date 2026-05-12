create table if not exists public.phonepe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  merchant_order_id text,
  checkout_session_id uuid references public.checkout_sessions(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  provider_event_id text,
  payload_hash text not null unique,
  signature_header text,
  authorization_header text,
  status text not null default 'received'
    check (status in ('received', 'processed', 'ignored', 'failed', 'invalid_signature')),
  processing_error text,
  raw_payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists phonepe_webhook_events_merchant_order_idx
on public.phonepe_webhook_events (merchant_order_id, received_at desc);

create index if not exists phonepe_webhook_events_session_idx
on public.phonepe_webhook_events (checkout_session_id, received_at desc);

alter table public.phonepe_webhook_events enable row level security;

create policy "Admins can read phonepe webhook events"
on public.phonepe_webhook_events for select
to authenticated
using (public.is_admin());
