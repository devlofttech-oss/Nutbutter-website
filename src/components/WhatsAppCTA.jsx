export default function WhatsAppCTA() {
  return (
    <a
      className="flex items-center justify-between p-md bg-[#25D366]/10 rounded-lg border border-[#25D366]/20 group transition-all duration-300 hover:bg-[#25D366]/20"
      href="https://wa.me/919607195225"
      rel="noreferrer"
      target="_blank"
    >
      <div className="flex items-center gap-md">
        <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            chat
          </span>
        </div>
        <div>
          <h2 className="text-label-md font-semibold text-primary">Live Concierge</h2>
          <p className="text-xs text-secondary">Chat with our butter artisans</p>
        </div>
      </div>
      <span className="material-symbols-outlined text-[#25D366] group-hover:translate-x-1 transition-transform">
        arrow_forward
      </span>
    </a>
  )
}
