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

export async function estimateShipping(pincode) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.functions.invoke('estimate-shipping', {
    body: { pincode },
  })

  if (error) await throwFunctionError(error)
  if (data?.error) throw new Error(data.error)

  return data
}

export async function createCheckoutSession(payload) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: payload,
  })

  if (error) await throwFunctionError(error)
  if (data?.error) throw new Error(data.error)

  return data
}
