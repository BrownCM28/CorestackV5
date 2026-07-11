import { describe, it, expect } from 'vitest'
import { CATEGORY_LABELS, CATEGORY_LIST, PRICE_DEFAULT, PRICE_MIN, PRICE_MAX } from '../constants'

describe('constants', () => {
  it('CATEGORY_LIST has 5 items', () => {
    expect(CATEGORY_LIST).toHaveLength(5)
  })

  it('every category has a label', () => {
    CATEGORY_LIST.forEach(c => expect(CATEGORY_LABELS[c]).toBeTruthy())
  })

  it('PRICE_DEFAULT is 99', () => {
    expect(PRICE_DEFAULT).toBe(99)
  })

  it('PRICE_MIN is 5', () => {
    expect(PRICE_MIN).toBe(5)
  })

  it('PRICE_MAX is 500', () => {
    expect(PRICE_MAX).toBe(500)
  })
})
