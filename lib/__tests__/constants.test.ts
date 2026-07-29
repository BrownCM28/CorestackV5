import { describe, it, expect } from 'vitest'
import { CATEGORY_LABELS, CATEGORY_LIST } from '../constants'

describe('constants', () => {
  it('every category has a label', () => {
    CATEGORY_LIST.forEach(c => expect(CATEGORY_LABELS[c]).toBeTruthy())
  })
})
