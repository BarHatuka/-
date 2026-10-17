import { describe, expect, test } from 'vitest'
import { formatRating, getYear } from './format'

describe('getYear', () => {
  test('takes the year from a TVmaze date', () => {
    expect(getYear('2011-09-22')).toBe('2011')
  })

  test('returns an empty string when there is no date', () => {
    expect(getYear(null)).toBe('')
  })
})

describe('formatRating', () => {
  test('always shows one digit after the point', () => {
    expect(formatRating(8.8)).toBe('8.8')
    expect(formatRating(8)).toBe('8.0')
  })

  test('returns null when the show has no rating', () => {
    expect(formatRating(null)).toBeNull()
  })
})
