import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import OrderTimeline from './OrderTimeline.jsx'

describe('OrderTimeline', () => {
  it('shows completed and pending ecommerce timeline steps', () => {
    render(
      <OrderTimeline
        events={[
          { status: 'order_placed', label: 'Order Placed', occurred_at: '2026-05-13T10:00:00Z' },
          { status: 'payment_confirmed', label: 'Payment Confirmed', occurred_at: '2026-05-13T10:01:00Z' },
        ]}
      />,
    )

    expect(screen.getByText('Order Placed')).toBeInTheDocument()
    expect(screen.getByText('Payment Confirmed')).toBeInTheDocument()
    expect(screen.getByText('Shipped')).toBeInTheDocument()
    expect(screen.getByText('Delivered')).toBeInTheDocument()
  })
})
