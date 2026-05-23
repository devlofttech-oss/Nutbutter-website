type PhonePeTokenResponse = {
  access_token?: string
  token_type?: string
  expires_at?: number
  code?: string
  message?: string
  error?: string
  error_description?: string
}

export type PhonePeStatusPayload = Record<string, unknown> & {
  state?: string
  status?: string
  code?: string
  merchantOrderId?: string
  transactionId?: string
  paymentDetails?: Array<Record<string, unknown>>
  metaInfo?: Record<string, unknown>
}

export function getPhonePeBaseUrl() {
  return Deno.env.get('PHONEPE_BASE_URL') ?? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
}

export function getPhonePeAuthBaseUrl() {
  return Deno.env.get('PHONEPE_AUTH_BASE_URL') ?? getPhonePeBaseUrl()
}

export async function getPhonePeAccessToken() {
  const clientId = Deno.env.get('PHONEPE_CLIENT_ID')
  const clientSecret = Deno.env.get('PHONEPE_CLIENT_SECRET')
  const clientVersion = Deno.env.get('PHONEPE_CLIENT_VERSION') ?? '1'
  const tokenUrl = Deno.env.get('PHONEPE_TOKEN_URL') ?? `${getPhonePeAuthBaseUrl()}/v1/oauth/token`

  if (!clientId || !clientSecret) {
    throw new Error('PhonePe credentials are not configured.')
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    client_version: clientVersion,
    grant_type: 'client_credentials',
  })

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const payload = await response.json().catch(() => ({})) as PhonePeTokenResponse

  if (!response.ok || !payload.access_token) {
    const providerMessage = payload.message ?? payload.error_description ?? payload.error ?? payload.code
    throw new Error(providerMessage ? `Unable to authenticate with PhonePe: ${providerMessage}` : 'Unable to authenticate with PhonePe.')
  }

  return payload.access_token
}

function getHeader(headers: Headers, name: string) {
  return headers.get(name) ?? headers.get(name.toLowerCase()) ?? ''
}

function encodeUtf8(value: string) {
  return new TextEncoder().encode(value)
}

function timingSafeEqual(a: string, b: string) {
  const left = encodeUtf8(a)
  const right = encodeUtf8(b)
  const length = Math.max(left.length, right.length)
  let diff = left.length ^ right.length

  for (let index = 0; index < length; index += 1) {
    diff |= (left[index] ?? 0) ^ (right[index] ?? 0)
  }

  return diff === 0
}

async function sha256Hex(value: string) {
  const hash = await crypto.subtle.digest('SHA-256', encodeUtf8(value))
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function verifyPhonePeWebhookSignature(headers: Headers, rawBody: string) {
  const callbackUsername = Deno.env.get('PHONEPE_CALLBACK_USERNAME')
  const callbackPassword = Deno.env.get('PHONEPE_CALLBACK_PASSWORD')
  const authorization = getHeader(headers, 'authorization')

  if (callbackUsername && callbackPassword) {
    const expectedAuthorization = `Basic ${btoa(`${callbackUsername}:${callbackPassword}`)}`
    if (timingSafeEqual(authorization, expectedAuthorization)) {
      return { ok: true, mode: 'basic_authorization' }
    }
  }

  const saltKey = Deno.env.get('PHONEPE_SALT_KEY')
  const saltIndex = Deno.env.get('PHONEPE_SALT_INDEX')
  const xVerify = getHeader(headers, 'x-verify')

  if (saltKey && saltIndex && xVerify) {
    const expectedXVerify = `${await sha256Hex(`${rawBody}${saltKey}`)}###${saltIndex}`
    if (timingSafeEqual(xVerify, expectedXVerify)) {
      return { ok: true, mode: 'x_verify' }
    }
  }

  return { ok: false, mode: 'none' }
}

function getData(payload: PhonePeStatusPayload) {
  return (payload.data ?? {}) as Record<string, unknown>
}

function getDataMetaInfo(payload: PhonePeStatusPayload) {
  return (getData(payload).metaInfo ?? {}) as Record<string, unknown>
}

export function getPhonePeMerchantOrderId(payload: PhonePeStatusPayload) {
  const data = getData(payload)

  return String(
    payload.merchantOrderId
      ?? data.merchantOrderId
      ?? data.merchantTransactionId
      ?? data.orderId
      ?? '',
  )
}

export function getPhonePeCheckoutSessionId(payload: PhonePeStatusPayload) {
  const data = getData(payload)
  const dataMetaInfo = getDataMetaInfo(payload)

  return String(
    payload.metaInfo?.udf1
      ?? dataMetaInfo.udf1
      ?? data.udf1
      ?? '',
  )
}

export function isPhonePePaymentSuccess(payload: PhonePeStatusPayload) {
  const data = getData(payload)
  const state = String(payload.state ?? payload.status ?? payload.code ?? data.state ?? data.status ?? '').toUpperCase()
  return ['COMPLETED', 'SUCCESS', 'PAYMENT_SUCCESS'].includes(state)
}

export function getPhonePeProviderState(payload: PhonePeStatusPayload) {
  const data = getData(payload)
  return String(payload.state ?? payload.status ?? payload.code ?? data.state ?? data.status ?? '').toUpperCase()
}

export function getPhonePeTransactionId(payload: PhonePeStatusPayload) {
  const data = getData(payload)

  return String(
    payload.transactionId
      ?? data.transactionId
      ?? payload.paymentDetails?.[0]?.transactionId
      ?? payload.paymentDetails?.[0]?.paymentId
      ?? '',
  )
}

export async function fetchPhonePeOrderStatus(merchantOrderId: string) {
  const token = await getPhonePeAccessToken()
  const statusResponse = await fetch(`${getPhonePeBaseUrl()}/checkout/v2/order/${merchantOrderId}/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `O-Bearer ${token}`,
    },
  })
  const payload = await statusResponse.json().catch(() => ({})) as PhonePeStatusPayload

  return {
    ok: statusResponse.ok,
    payload,
  }
}
