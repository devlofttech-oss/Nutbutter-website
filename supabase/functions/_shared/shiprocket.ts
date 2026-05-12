type ShiprocketAuthResponse = {
  token?: string
}

type ServiceabilityParams = {
  deliveryPincode: string
  cod?: boolean
  weightKg: number
  orderAmount: number
}

export type NormalizedCourier = {
  courierId: number
  courierName: string
  freightCharge: number
  codAvailable: boolean
  estimatedDeliveryDays: number | null
  estimatedDeliveryDate: string | null
  raw: Record<string, unknown>
}

export function getShiprocketBaseUrl() {
  return Deno.env.get('SHIPROCKET_BASE_URL') ?? 'https://apiv2.shiprocket.in/v1/external'
}

export function getShiprocketPickupPostcode() {
  const pickupPostcode = Deno.env.get('SHIPROCKET_PICKUP_POSTCODE')
  if (!pickupPostcode) throw new Error('Shiprocket pickup postcode is not configured.')
  return pickupPostcode
}

export function getShiprocketPickupLocation() {
  const pickupLocation = Deno.env.get('SHIPROCKET_PICKUP_LOCATION')
  if (!pickupLocation) throw new Error('Shiprocket pickup location is not configured.')
  return pickupLocation
}

export function getDefaultPackageWeightKg() {
  return Number(Deno.env.get('SHIPROCKET_DEFAULT_WEIGHT_KG') ?? '0.5')
}

async function shiprocketFetch(path: string, options: RequestInit = {}) {
  const token = await getShiprocketToken()
  const response = await fetch(`${getShiprocketBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = payload?.message ?? payload?.error ?? 'Shiprocket request failed.'
    throw new Error(String(message))
  }

  return payload
}

export async function getShiprocketToken() {
  const email = Deno.env.get('SHIPROCKET_EMAIL')
  const password = Deno.env.get('SHIPROCKET_PASSWORD')

  if (!email || !password) {
    throw new Error('Shiprocket credentials are not configured.')
  }

  const response = await fetch(`${getShiprocketBaseUrl()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const payload = await response.json().catch(() => ({})) as ShiprocketAuthResponse

  if (!response.ok || !payload.token) {
    throw new Error('Unable to authenticate with Shiprocket.')
  }

  return payload.token
}

function toNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : fallback
}

function normalizeCourier(rawCourier: Record<string, unknown>): NormalizedCourier {
  const courierId = toNumber(rawCourier.courier_company_id ?? rawCourier.courier_id)
  const estimatedDays = rawCourier.estimated_delivery_days ?? rawCourier.etd_days ?? rawCourier.etd

  return {
    courierId,
    courierName: String(rawCourier.courier_name ?? rawCourier.courier_company_name ?? 'Shiprocket Courier'),
    freightCharge: toNumber(rawCourier.freight_charge ?? rawCourier.rate ?? rawCourier.charges),
    codAvailable: Boolean(rawCourier.cod ?? rawCourier.cod_available),
    estimatedDeliveryDays: estimatedDays ? toNumber(estimatedDays, 0) || null : null,
    estimatedDeliveryDate: typeof rawCourier.etd === 'string' && /^\d{4}-\d{2}-\d{2}/.test(rawCourier.etd)
      ? rawCourier.etd.slice(0, 10)
      : null,
    raw: rawCourier,
  }
}

function getAvailableCouriers(payload: Record<string, unknown>) {
  const data = payload.data as Record<string, unknown> | undefined
  const couriers = data?.available_courier_companies ?? payload.available_courier_companies ?? []
  return Array.isArray(couriers) ? couriers.map((courier) => normalizeCourier(courier as Record<string, unknown>)) : []
}

export async function getServiceabilityEstimate(params: ServiceabilityParams) {
  const query = new URLSearchParams({
    pickup_postcode: getShiprocketPickupPostcode(),
    delivery_postcode: params.deliveryPincode,
    cod: params.cod ? '1' : '0',
    weight: Math.max(params.weightKg, 0.1).toFixed(2),
    declared_value: Math.max(params.orderAmount, 1).toFixed(0),
  })

  const payload = await shiprocketFetch(`/courier/serviceability/?${query.toString()}`, {
    method: 'GET',
  }) as Record<string, unknown>

  const couriers = getAvailableCouriers(payload)
    .filter((courier) => courier.courierId > 0 && courier.freightCharge >= 0)
    .sort((a, b) => a.freightCharge - b.freightCharge)

  if (couriers.length === 0) {
    throw new Error('No Shiprocket courier is serviceable for this pincode.')
  }

  return { couriers, raw: payload }
}

export async function createShiprocketOrder(payload: Record<string, unknown>) {
  return shiprocketFetch('/orders/create/adhoc', {
    method: 'POST',
    body: JSON.stringify(payload),
  }) as Promise<Record<string, unknown>>
}

export async function assignShiprocketAwb(shipmentId: string | number, courierId?: number | null) {
  return shiprocketFetch('/courier/assign/awb', {
    method: 'POST',
    body: JSON.stringify({
      shipment_id: shipmentId,
      ...(courierId ? { courier_id: courierId } : {}),
    }),
  }) as Promise<Record<string, unknown>>
}

export async function trackShiprocketAwb(awbCode: string) {
  return shiprocketFetch(`/courier/track/awb/${encodeURIComponent(awbCode)}`, {
    method: 'GET',
  }) as Promise<Record<string, unknown>>
}
