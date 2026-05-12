import { requireSupabaseClient } from '../lib/supabaseClient.js'

export async function estimateShipping(pincode) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.functions.invoke('estimate-shipping', {
    body: { pincode },
  })

  if (error) throw error
  if (data?.error) throw new Error(data.error)

  return data
}

export async function createCheckoutSession(payload) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: payload,
  })

  if (error) throw error
  if (data?.error) throw new Error(data.error)

  return data
}
