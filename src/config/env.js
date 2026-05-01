const viteEnv = import.meta.env ?? {}

export const env = {
  supabaseUrl: viteEnv.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: viteEnv.VITE_SUPABASE_ANON_KEY ?? '',
  appUrl: viteEnv.VITE_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : ''),
  isDevelopment: viteEnv.DEV === true,
}

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey)

