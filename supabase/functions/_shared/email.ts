import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

type EmailEventPayload = {
  eventType: string
  dedupeKey: string
  to: string
  subject: string
  html: string
  text?: string
  payload?: Record<string, unknown>
}

type MoneyInput = string | number | null | undefined

const brand = {
  name: Deno.env.get('EMAIL_FROM_NAME') ?? 'Satvegik',
  from: Deno.env.get('EMAIL_FROM') ?? 'Satvegik <orders@satvegik.com>',
  supportEmail: Deno.env.get('SUPPORT_EMAIL') ?? 'support@satvegik.com',
  appUrl: Deno.env.get('FRONTEND_URL') ?? 'http://localhost:5173',
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function formatCurrency(value: MoneyInput) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function formatDate(value: unknown) {
  if (!value) return 'To be confirmed'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(String(value)))
}

function baseEmail(title: string, preview: string, body: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <style>
      body { margin: 0; background: #f7f2ea; color: #33210d; font-family: Georgia, 'Times New Roman', serif; }
      .preheader { display: none; max-height: 0; overflow: hidden; opacity: 0; }
      .wrap { width: 100%; padding: 28px 12px; }
      .card { max-width: 680px; margin: 0 auto; background: #fffaf2; border: 1px solid #e3d8c8; border-radius: 18px; overflow: hidden; }
      .hero { background: #33210d; color: #fffaf2; padding: 34px 28px; }
      .brand { font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; color: #dfcaa7; font-family: Arial, sans-serif; font-weight: 700; }
      h1 { margin: 12px 0 0; font-size: 34px; line-height: 1.1; font-weight: 400; }
      .content { padding: 28px; }
      p { font-size: 16px; line-height: 1.65; margin: 0 0 16px; }
      .panel { border: 1px solid #e3d8c8; background: #fffdf8; border-radius: 14px; padding: 18px; margin: 18px 0; }
      .row { display: flex; justify-content: space-between; gap: 16px; border-bottom: 1px solid #eadfce; padding: 10px 0; font-family: Arial, sans-serif; font-size: 14px; }
      .row:last-child { border-bottom: 0; }
      .muted { color: #7a6a56; }
      .button { display: inline-block; background: #33210d; color: #fffaf2 !important; text-decoration: none; padding: 14px 22px; border-radius: 999px; font-family: Arial, sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; }
      .footer { padding: 22px 28px; background: #efe5d4; color: #6f5d46; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6; }
      @media (max-width: 520px) {
        .hero, .content, .footer { padding-left: 18px; padding-right: 18px; }
        h1 { font-size: 28px; }
        .row { display: block; }
        .row strong { display: block; margin-top: 4px; }
      }
    </style>
  </head>
  <body>
    <span class="preheader">${escapeHtml(preview)}</span>
    <div class="wrap">
      <main class="card">
        <section class="hero">
          <div class="brand">${escapeHtml(brand.name)}</div>
          <h1>${escapeHtml(title)}</h1>
        </section>
        <section class="content">${body}</section>
        <footer class="footer">
          Need help? Reply to this email or write to ${escapeHtml(brand.supportEmail)}.<br>
          You are receiving this transactional email because of activity on your Satvegik account.
        </footer>
      </main>
    </div>
  </body>
</html>`
}

export function renderOrderConfirmationEmail(order: Record<string, unknown>) {
  const items = (order.order_items ?? []) as Array<Record<string, unknown>>
  const shippingAddress = order.shipping_address as Record<string, unknown> | undefined
  const shipment = ((order.shipments ?? []) as Array<Record<string, unknown>>)[0]
  const itemRows = items.map((item) => `
    <div class="row">
      <span>${escapeHtml(item.product_name)} x ${escapeHtml(item.quantity)}</span>
      <strong>${formatCurrency(item.line_total as MoneyInput)}</strong>
    </div>
  `).join('')
  const address = shippingAddress
    ? `${escapeHtml(shippingAddress.full_name)}<br>${escapeHtml(shippingAddress.address_line1)}${shippingAddress.address_line2 ? `<br>${escapeHtml(shippingAddress.address_line2)}` : ''}<br>${escapeHtml(shippingAddress.city)}, ${escapeHtml(shippingAddress.state)} ${escapeHtml(shippingAddress.pincode)}`
    : 'Shipping address saved with your order.'

  const body = `
    <p>Your payment is confirmed and your order is now being prepared.</p>
    <div class="panel">
      <div class="row"><span>Order ID</span><strong>${escapeHtml(order.order_number)}</strong></div>
      <div class="row"><span>Payment Method</span><strong>PhonePe</strong></div>
      <div class="row"><span>Estimated Delivery</span><strong>${formatDate(order.estimated_delivery_date ?? shipment?.estimated_delivery_date)}</strong></div>
    </div>
    <div class="panel">${itemRows}</div>
    <div class="panel">
      <div class="row"><span>Subtotal</span><strong>${formatCurrency(order.subtotal as MoneyInput)}</strong></div>
      <div class="row"><span>Shipping</span><strong>${formatCurrency(order.shipping_amount as MoneyInput)}</strong></div>
      <div class="row"><span>Tax</span><strong>${formatCurrency(order.tax_amount as MoneyInput)}</strong></div>
      <div class="row"><span>Total</span><strong>${formatCurrency(order.total_amount as MoneyInput)}</strong></div>
    </div>
    <div class="panel"><p class="muted" style="margin:0;">${address}</p></div>
    <p><a class="button" href="${brand.appUrl}/orders">View Order</a></p>
  `

  return baseEmail('Order Confirmed', `Order ${String(order.order_number)} is confirmed.`, body)
}

export function renderShippingConfirmationEmail(order: Record<string, unknown>, shipment: Record<string, unknown>) {
  const trackingUrl = String(shipment.tracking_url ?? `${brand.appUrl}/orders`)
  const body = `
    <p>Your order has been handed to our courier partner.</p>
    <div class="panel">
      <div class="row"><span>Order ID</span><strong>${escapeHtml(order.order_number)}</strong></div>
      <div class="row"><span>Courier Partner</span><strong>${escapeHtml(shipment.courier_name ?? order.shiprocket_courier_name ?? 'Shiprocket')}</strong></div>
      <div class="row"><span>Tracking Number</span><strong>${escapeHtml(shipment.awb_code)}</strong></div>
      <div class="row"><span>Estimated Delivery</span><strong>${formatDate(shipment.estimated_delivery_date ?? order.estimated_delivery_date)}</strong></div>
    </div>
    <p><a class="button" href="${escapeHtml(trackingUrl)}">Track Shipment</a></p>
  `

  return baseEmail('Shipping Confirmed', `Tracking is ready for order ${String(order.order_number)}.`, body)
}

export async function queueAndSendEmail(serviceClient: SupabaseClient, email: EmailEventPayload) {
  const { data: existing } = await serviceClient
    .from('email_events')
    .select('*')
    .eq('dedupe_key', email.dedupeKey)
    .maybeSingle()

  if (existing?.status === 'sent') return { skipped: true, event: existing }

  const { data: event, error: eventError } = await serviceClient
    .from('email_events')
    .upsert({
      id: existing?.id,
      event_type: email.eventType,
      dedupe_key: email.dedupeKey,
      recipient: email.to,
      subject: email.subject,
      status: 'sending',
      attempts: (existing?.attempts ?? 0) + 1,
      payload: {
        ...(email.payload ?? {}),
        html: email.html,
        text: email.text ?? '',
      },
      last_error: null,
      next_retry_at: null,
    }, { onConflict: 'dedupe_key' })
    .select('*')
    .single()

  if (eventError) throw eventError

  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    await serviceClient
      .from('email_events')
      .update({
        status: 'skipped',
        last_error: 'RESEND_API_KEY is not configured.',
      })
      .eq('id', event.id)

    return { skipped: true, event }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: brand.from,
        to: [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
    })
    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(String(payload?.message ?? payload?.error ?? 'Resend email request failed.'))
    }

    await serviceClient
      .from('email_events')
      .update({
        status: 'sent',
        provider_message_id: String(payload?.id ?? ''),
        sent_at: new Date().toISOString(),
        last_error: null,
      })
      .eq('id', event.id)

    return { skipped: false, event, provider: payload }
  } catch (error) {
    await serviceClient
      .from('email_events')
      .update({
        status: 'failed',
        last_error: error.message ?? 'Email send failed.',
        next_retry_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      })
      .eq('id', event.id)

    return { skipped: false, event, error }
  }
}
