import { requireSupabaseClient } from '../lib/supabaseClient.js'

export async function createPhonePePayment(checkoutSessionId) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.functions.invoke('create-phonepe-payment', {
    body: { checkoutSessionId },
  })

  if (error) throw error
  if (data?.error) throw new Error(data.error)

  return data
}

export async function verifyPhonePePayment(checkoutSessionId, merchantOrderId) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.functions.invoke('verify-phonepe-payment', {
    body: { checkoutSessionId, merchantOrderId },
  })

  if (error) throw error
  if (data?.error) throw new Error(data.error)

  return data
}
