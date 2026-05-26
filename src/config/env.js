const viteEnv = import.meta.env ?? {}

function readBoolean(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value ?? '').toLowerCase())
}

export const env = {
  supabaseUrl: viteEnv.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: viteEnv.VITE_SUPABASE_ANON_KEY ?? '',
  appUrl: viteEnv.VITE_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : ''),
  freeShippingEnabled: readBoolean(viteEnv.VITE_FREE_SHIPPING_ENABLED),
  isDevelopment: viteEnv.DEV === true,
}

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey)

