export default function DeliveryOptions({
  couriers = [],
  selectedCourierId,
  onChange,
  isLoading = false,
  error = '',
  codAvailable = false,
  pincode = '',
}) {
  return (
    <section className="space-y-md">
      <h2 className="font-serif text-xl md:text-headline-md text-primary flex items-center gap-base border-b border-outline-variant pb-base">
        <span className="material-symbols-outlined">local_shipping</span>
        Shipping Method
      </h2>

      {!pincode && (
        <p className="rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant">
          Enter your delivery pincode to view live Shiprocket shipping options.
        </p>
      )}
      {isLoading && (
        <p className="rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant">
          Checking courier availability and delivery estimates...
        </p>
      )}
      {error && (
        <p className="rounded-xl border border-error/40 bg-surface-container-low p-4 text-sm font-semibold text-error">
          {error}
        </p>
      )}
      {couriers.length > 0 && (
        <p className="text-sm text-on-surface-variant">
          COD availability: <span className="font-semibold text-primary">{codAvailable ? 'Available for this pincode' : 'Not available for this pincode'}</span>
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {couriers.map((option) => {
          const selected = Number(selectedCourierId) === Number(option.courierId)
          return (
            <label
              key={option.courierId}
              className={`relative flex cursor-pointer rounded-xl border-2 p-4 md:p-md bg-surface-bright transition-all ${
                selected ? 'border-secondary shadow-lg' : 'border-outline-variant hover:border-secondary'
              }`}
            >
              <input
                checked={selected}
                className="sr-only"
                name="delivery"
                type="radio"
                value={option.courierId}
                onChange={(event) => onChange(Number(event.target.value))}
              />
              <div className="flex-grow pr-8 md:pr-lg">
                <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between gap-1 min-[380px]:gap-sm">
                  <span className="text-label-md font-semibold text-primary">{option.courierName}</span>
                  <span className="text-label-md font-semibold text-primary">{formatCurrency(option.freightCharge)}</span>
                </div>
                <p className="text-label-sm text-on-surface-variant mt-xs">
                  {option.estimatedDeliveryDays ? `${option.estimatedDeliveryDays} day estimate` : 'Estimated delivery shown after confirmation'}
                </p>
              </div>
              {selected && (
                <span className="absolute top-md right-md material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              )}
            </label>
          )
        })}
      </div>
    </section>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}
