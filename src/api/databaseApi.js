import { requireSupabaseClient } from '../lib/supabaseClient.js'

function applyFilters(query, filters = []) {
  return filters.reduce((currentQuery, filter) => {
    const { column, operator = 'eq', value } = filter

    if (typeof currentQuery[operator] !== 'function') {
      throw new Error(`Unsupported Supabase filter operator: ${operator}`)
    }

    return currentQuery[operator](column, value)
  }, query)
}

function applyQueryOptions(query, options = {}) {
  let nextQuery = applyFilters(query, options.filters)

  const orders = options.orders ?? (options.order ? [options.order] : [])

  orders.forEach((order) => {
    nextQuery = nextQuery.order(order.column, {
      ascending: order.ascending ?? true,
      nullsFirst: order.nullsFirst,
      referencedTable: order.referencedTable,
    })
  })

  if (options.range) {
    nextQuery = nextQuery.range(options.range.from, options.range.to)
  }

  if (options.maybeSingle) return nextQuery.maybeSingle()

  return options.single ? nextQuery.single() : nextQuery
}

export async function selectRows(table, options = {}) {
  const supabase = requireSupabaseClient()
  const query = supabase.from(table).select(options.columns ?? '*')
  const { data, error, count } = await applyQueryOptions(query, options)

  if (error) throw error

  return { data, count }
}

export async function insertRows(table, payload, options = {}) {
  const supabase = requireSupabaseClient()
  const query = supabase.from(table).insert(payload)
  const { data, error } = await (options.returning === false ? query : query.select(options.columns ?? '*'))

  if (error) throw error

  return data
}

export async function updateRows(table, payload, filters = [], options = {}) {
  const supabase = requireSupabaseClient()
  const query = supabase.from(table).update(payload)
  const { data, error } = await applyQueryOptions(query.select(options.columns ?? '*'), { filters })

  if (error) throw error

  return data
}

export async function deleteRows(table, filters = []) {
  const supabase = requireSupabaseClient()
  const query = supabase.from(table).delete()
  const { data, error } = await applyQueryOptions(query.select('*'), { filters })

  if (error) throw error

  return data
}
