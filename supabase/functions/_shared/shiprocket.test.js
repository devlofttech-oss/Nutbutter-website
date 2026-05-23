import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const shiprocketSource = readFileSync(
  resolve(process.cwd(), 'supabase/functions/_shared/shiprocket.ts'),
  'utf8',
)
const fulfillmentSource = readFileSync(
  resolve(process.cwd(), 'supabase/functions/_shared/fulfillment.ts'),
  'utf8',
)

describe('Shiprocket fulfillment mode', () => {
  it('supports order-only Shiprocket sync without AWB assignment', () => {
    expect(shiprocketSource).toContain('SHIPROCKET_FULFILLMENT_MODE')
    expect(shiprocketSource).toContain("fulfillmentMode !== 'order_only'")
    expect(shiprocketSource).toContain('SHIPROCKET_SKIP_AWB_ASSIGNMENT')
    expect(fulfillmentSource).toContain('shouldAssignShiprocketAwb()')
    expect(fulfillmentSource.indexOf('shouldAssignShiprocketAwb()')).toBeLessThan(
      fulfillmentSource.indexOf('assignShiprocketAwb('),
    )
  })
})
