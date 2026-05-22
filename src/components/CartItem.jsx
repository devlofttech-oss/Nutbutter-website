export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="group grid grid-cols-1 sm:grid-cols-[144px_minmax(0,1fr)] gap-5 md:gap-6 p-4 md:p-5 bg-white/80 rounded-xl border border-outline-variant shadow-[0_12px_35px_rgba(115,91,66,0.06)] transition-all duration-300 hover:bg-white hover:shadow-lg">
      <div className="w-full sm:w-36 h-44 sm:h-36 overflow-hidden rounded-lg bg-surface-container">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={item.image}
          alt={item.name}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-start gap-5 md:gap-8 min-w-0">
        <div className="text-center sm:text-left space-y-2 min-w-0">
          <h3 className="font-serif text-xl md:text-2xl text-primary-container leading-tight">{item.name}</h3>
          <p className="text-sm font-medium text-on-surface-variant">{item.variant}</p>
          <button
            className="inline-flex items-center gap-1.5 mx-auto sm:mx-0 text-xs font-semibold text-error hover:text-red-700 transition-colors pt-2 uppercase tracking-wider"
            type="button"
            onClick={() => onRemove(item.id)}
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Remove
          </button>
        </div>

        <div className="flex flex-row md:flex-col items-center justify-between md:justify-start md:items-end gap-4 w-full md:w-auto">
          <div className="font-serif text-xl md:text-2xl font-semibold text-primary-container">{formatCurrency(item.price)}</div>
          <div className="flex items-center justify-between border border-outline-variant rounded-full px-3 py-1 bg-white min-w-[116px]">
            <button
              className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary transition-colors p-1 disabled:opacity-30"
              type="button"
              onClick={() => onDecrease(item.id)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease ${item.name} quantity`}
            >
              remove
            </button>
            <span className="mx-3 text-label-md font-semibold w-6 text-center">{item.quantity}</span>
            <button
              className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary transition-colors p-1"
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
