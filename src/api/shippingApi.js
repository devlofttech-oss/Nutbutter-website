import { requireSupabaseClient } from '../lib/supabaseClient.js'

export async function trackShipment(orderId) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.functions.invoke('track-shipment', {
    body: { orderId },
  })

  if (error) throw error
  if (data?.error) throw new Error(data.error)

  return data
}
