import { requireSupabaseClient } from '../lib/supabaseClient.js'

async function throwFunctionError(error) {
  const response = error?.context

  if (response && typeof response.json === 'function') {
    const payload = await response.json().catch(() => null)
    if (payload?.error) {
      throw new Error(payload.error)
    }
  }

  throw error
}

export async function createPhonePePayment(checkoutSessionId) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.functions.invoke('create-phonepe-payment', {
    body: { checkoutSessionId },
  })

  if (error) await throwFunctionError(error)
  if (data?.error) throw new Error(data.error)

  return data
}

export async function verifyPhonePePayment(checkoutSessionId, merchantOrderId) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.functions.invoke('verify-phonepe-payment', {
    body: { checkoutSessionId, merchantOrderId },
  })

  if (error) await throwFunctionError(error)
  if (data?.error) throw new Error(data.error)

  return data
}
