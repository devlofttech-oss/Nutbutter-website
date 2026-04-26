export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="group flex flex-col sm:flex-row items-center gap-8 p-6 bg-white/40 rounded-xl border border-outline-variant shadow-sm transition-all duration-300 hover:bg-white/60 hover:shadow-lg">
      <div className="w-full sm:w-40 h-40 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={item.image}
          alt={item.name}
        />
      </div>

      <div className="flex-grow flex flex-col sm:flex-row justify-between items-center sm:items-start w-full gap-4">
        <div className="text-center sm:text-left space-y-2">
          <h3 className="font-serif text-headline-md text-primary-container leading-tight">{item.name}</h3>
          <p className="text-sm text-on-surface-variant">{item.variant}</p>
          <button
            className="inline-flex items-center gap-1.5 mx-auto sm:mx-0 text-xs font-semibold text-error hover:text-red-700 transition-colors pt-2 uppercase tracking-wider"
            type="button"
            onClick={() => onRemove(item.id)}
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Remove
          </button>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-4">
          <div className="font-serif text-headline-md text-primary-container">{formatCurrency(item.price)}</div>
          <div className="flex items-center border border-outline-variant rounded-full px-3 py-1 bg-white/50">
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
