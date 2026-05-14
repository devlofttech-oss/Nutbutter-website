import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPhonePePayment, verifyPhonePePayment } from './paymentApi.js'

const invoke = vi.fn()

vi.mock('../lib/supabaseClient.js', () => ({
  requireSupabaseClient: () => ({
    functions: { invoke },
  }),
}))

describe('paymentApi', () => {
  beforeEach(() => {
    invoke.mockReset()
  })

  it('creates a PhonePe payment for a checkout session', async () => {
    invoke.mockResolvedValue({ data: { redirectUrl: 'https://phonepe.test/pay' }, error: null })

    await expect(createPhonePePayment('session-1')).resolves.toEqual({ redirectUrl: 'https://phonepe.test/pay' })
    expect(invoke).toHaveBeenCalledWith('create-phonepe-payment', { body: { checkoutSessionId: 'session-1' } })
  })

  it('verifies payment with checkout and merchant order ids', async () => {
    invoke.mockResolvedValue({ data: { success: true, orderId: 'order-1' }, error: null })

    await expect(verifyPhonePePayment('session-1', 'merchant-1')).resolves.toEqual({ success: true, orderId: 'order-1' })
    expect(invoke).toHaveBeenCalledWith('verify-phonepe-payment', {
      body: { checkoutSessionId: 'session-1', merchantOrderId: 'merchant-1' },
    })
  })
})
