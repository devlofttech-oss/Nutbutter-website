import { requireSupabaseClient } from '../lib/supabaseClient.js'

export async function createPhonePePayment(orderId) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.functions.invoke('create-phonepe-payment', {
    body: { orderId },
  })

  if (error) throw error
  if (data?.error) throw new Error(data.error)

  return data
}

export async function verifyPhonePePayment(orderId, merchantOrderId) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.functions.invoke('verify-phonepe-payment', {
    body: { orderId, merchantOrderId },
  })

  if (error) throw error
  if (data?.error) throw new Error(data.error)

  return data
}
