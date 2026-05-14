import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCheckoutSession, estimateShipping } from './checkoutApi.js'

const invoke = vi.fn()

vi.mock('../lib/supabaseClient.js', () => ({
  requireSupabaseClient: () => ({
    functions: { invoke },
  }),
}))

describe('checkoutApi', () => {
  beforeEach(() => {
    invoke.mockReset()
  })

  it('estimates shipping through the Supabase Edge Function', async () => {
    invoke.mockResolvedValue({ data: { couriers: [{ courierId: 1 }] }, error: null })

    await expect(estimateShipping('560001')).resolves.toEqual({ couriers: [{ courierId: 1 }] })
    expect(invoke).toHaveBeenCalledWith('estimate-shipping', { body: { pincode: '560001' } })
  })

  it('surfaces checkout session Edge Function errors', async () => {
    invoke.mockResolvedValue({ data: { error: 'Your cart is empty.' }, error: null })

    await expect(createCheckoutSession({})).rejects.toThrow('Your cart is empty.')
  })
})
