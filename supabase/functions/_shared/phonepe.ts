type PhonePeTokenResponse = {
  access_token?: string
  token_type?: string
  expires_at?: number
}

export function getPhonePeBaseUrl() {
  return Deno.env.get('PHONEPE_BASE_URL') ?? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
}

export async function getPhonePeAccessToken() {
  const clientId = Deno.env.get('PHONEPE_CLIENT_ID')
  const clientSecret = Deno.env.get('PHONEPE_CLIENT_SECRET')
  const clientVersion = Deno.env.get('PHONEPE_CLIENT_VERSION') ?? '1'

  if (!clientId || !clientSecret) {
    throw new Error('PhonePe credentials are not configured.')
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    client_version: clientVersion,
    grant_type: 'client_credentials',
  })

  const response = await fetch(`${getPhonePeBaseUrl()}/v1/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const payload = await response.json() as PhonePeTokenResponse

  if (!response.ok || !payload.access_token) {
    throw new Error('Unable to authenticate with PhonePe.')
  }

  return payload.access_token
}

