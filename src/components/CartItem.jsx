export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="group grid grid-cols-[88px_minmax(0,1fr)] sm:grid-cols-[144px_minmax(0,1fr)] gap-3 sm:gap-5 md:gap-6 p-3 sm:p-4 md:p-5 bg-white/85 rounded-xl border border-outline-variant shadow-[0_10px_26px_rgba(115,91,66,0.05)] transition-all duration-300 hover:bg-white hover:shadow-lg">
      <div className="w-[88px] sm:w-36 h-[108px] sm:h-36 overflow-hidden rounded-lg bg-surface-container">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={item.image}
          alt={item.name}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-start gap-3 md:gap-8 min-w-0">
        <div className="text-left space-y-1.5 min-w-0">
          <h3 className="font-serif text-[18px] sm:text-xl md:text-2xl text-primary-container leading-snug">{item.name}</h3>
          <p className="text-xs sm:text-sm font-medium text-on-surface-variant">{item.variant}</p>
          <button
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-error hover:text-red-700 transition-colors pt-1 uppercase tracking-[0.08em]"
            type="button"
            onClick={() => onRemove(item.id)}
          >
            <span className="material-symbols-outlined text-[15px]">delete</span>
            Remove
          </button>
        </div>

        <div className="flex flex-row md:flex-col items-center justify-between md:justify-start md:items-end gap-3 md:gap-4 w-full md:w-auto">
          <div className="font-serif text-[19px] md:text-2xl font-semibold text-primary-container">{formatCurrency(item.price)}</div>
          <div className="flex items-center justify-between border border-outline-variant rounded-full px-2 py-1 bg-white min-w-[104px] h-9">
            <button
              className="material-symbols-outlined text-[16px] text-on-surface-variant hover:text-primary transition-colors p-1 disabled:opacity-30"
              type="button"
              onClick={() => onDecrease(item.id)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease ${item.name} quantity`}
            >
              remove
            </button>
            <span className="mx-2 text-sm font-semibold w-5 text-center">{item.quantity}</span>
            <button
              className="material-symbols-outlined text-[16px] text-on-surface-variant hover:text-primary transition-colors p-1"
              type="button"
              onClick={() => onIncrease(item.id)}
              aria-label={`Increase ${item.name} quantity`}
            >
              add
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}
