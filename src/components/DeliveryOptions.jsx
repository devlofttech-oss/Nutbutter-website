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
    <section className="space-y-4 md:space-y-md">
      <h2 className="font-serif text-[22px] md:text-headline-md text-primary flex items-center gap-2 md:gap-base border-b border-outline-variant pb-3 md:pb-base">
        <span className="material-symbols-outlined text-[21px] md:text-2xl">local_shipping</span>
        Shipping Method
      </h2>

      {!pincode && (
        <p className="rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm leading-6 text-on-surface-variant">
          Enter your delivery pincode to view live shipping charges and courier options.
        </p>
      )}
      {isLoading && (
        <p className="rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm leading-6 text-on-surface-variant">
          Checking courier availability and delivery estimates...
        </p>
      )}
      {error && (
        <p className="rounded-xl border border-error/40 bg-surface-container-low p-4 text-sm leading-6 font-semibold text-error">
          {error}
        </p>
      )}
      {couriers.length > 0 && (
        <p className="text-sm leading-6 text-on-surface-variant">
          COD availability: <span className="font-semibold text-primary">{codAvailable ? 'Available for this pincode' : 'Not available for this pincode'}</span>
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-md">
        {couriers.map((option) => {
          const selected = Number(selectedCourierId) === Number(option.courierId)
          return (
            <label
              key={option.courierId}
              className={`relative flex cursor-pointer rounded-xl border p-4 md:p-md bg-surface-bright transition-all ${
                selected ? 'border-secondary shadow-[0_10px_28px_rgba(115,91,66,0.08)]' : 'border-outline-variant hover:border-secondary'
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
              <div className="flex-grow pr-8 md:pr-lg min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm md:text-label-md font-semibold text-primary leading-5">{option.courierName}</span>
                  <span className="text-sm md:text-label-md font-semibold text-primary whitespace-nowrap">{formatCurrency(option.freightCharge)}</span>
                </div>
                <p className="text-xs md:text-label-sm text-on-surface-variant mt-1 md:mt-xs">
                  {option.estimatedDeliveryDays ? `${option.estimatedDeliveryDays} day estimate` : 'Estimated delivery shown before payment confirmation'}
                </p>
              </div>
              {selected && (
                <span className="absolute top-4 right-4 material-symbols-outlined text-[20px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
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
