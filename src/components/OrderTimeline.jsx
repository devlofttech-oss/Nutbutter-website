const defaultSteps = [
  ['order_placed', 'Order Placed'],
  ['payment_confirmed', 'Payment Confirmed'],
  ['packed', 'Packed'],
  ['shipped', 'Shipped'],
  ['out_for_delivery', 'Out For Delivery'],
  ['delivered', 'Delivered'],
]

export default function OrderTimeline({ events = [], compact = false }) {
  const eventMap = new Map(events.map((event) => [event.status, event]))

  return (
    <div className={compact ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' : 'space-y-3'}>
      {defaultSteps.map(([status, fallbackLabel]) => {
        const event = eventMap.get(status)
        const isDone = Boolean(event)

        return (
          <div key={status} className="flex gap-3">
            <span className={`mt-1 h-3 w-3 shrink-0 rounded-full border ${isDone ? 'bg-primary border-primary' : 'bg-transparent border-outline-variant'}`} />
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${isDone ? 'text-primary' : 'text-on-surface-variant'}`}>
                {event?.label ?? fallbackLabel}
              </p>
              {event?.occurred_at && (
                <p className="text-xs text-on-surface-variant mt-1">
                  {new Date(event.occurred_at).toLocaleString('en-IN')}
                </p>
              )}
              {!compact && event?.description && (
                <p className="text-sm text-on-surface-variant mt-1">{event.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
