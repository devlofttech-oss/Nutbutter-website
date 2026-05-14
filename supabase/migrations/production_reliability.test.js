import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const migration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/202605130002_production_reliability.sql'),
  'utf8',
)

describe('production reliability migration', () => {
  it('adds atomic checkout finalization for inventory locking and idempotent order creation', () => {
    expect(migration).toContain('finalize_paid_checkout_session')
    expect(migration).toContain('for update')
    expect(migration).toContain('stock_quantity = stock_quantity - v_item.quantity')
    expect(migration).toContain('orders_checkout_session_unique_idx')
  })

  it('adds persistent timeline and email event tables', () => {
    expect(migration).toContain('create table if not exists public.order_timeline_events')
    expect(migration).toContain('create table if not exists public.email_events')
    expect(migration).toContain('dedupe_key text not null unique')
  })
})
