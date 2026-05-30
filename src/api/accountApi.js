import { selectRows } from './databaseApi.js'
import { SUPABASE_TABLES } from '../lib/supabase/tables.js'

export async function fetchMyProfile(userId) {
  if (!userId) return null

  const { data } = await selectRows(SUPABASE_TABLES.profiles, {
    filters: [{ column: 'id', value: userId }],
    maybeSingle: true,
  })

  return data
}
