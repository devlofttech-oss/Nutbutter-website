import { vi } from 'vitest'

export function createInvokeMock({ data = null, error = null } = {}) {
  return vi.fn().mockResolvedValue({ data, error })
}

export function createQueryResult({ data = null, error = null, count = null } = {}) {
  const result = Promise.resolve({ data, error, count })
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    neq: vi.fn(() => query),
    ilike: vi.fn(() => query),
    order: vi.fn(() => query),
    range: vi.fn(() => query),
    maybeSingle: vi.fn(() => result),
    single: vi.fn(() => result),
    then: result.then.bind(result),
    catch: result.catch.bind(result),
    finally: result.finally.bind(result),
  }

  return query
}
