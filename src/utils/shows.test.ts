import { expect, test } from 'vitest'
import { makeShow } from '../test/shows'
import { wallOrder } from './shows'

test('the wall is ordered from the highest rating down, and a show without a rating goes last', () => {
  const shows = [
    makeShow({ id: 1, rating: { average: 7.1 } }),
    makeShow({ id: 2, rating: { average: null } }),
    makeShow({ id: 3, rating: { average: 8.8 } }),
  ]
  expect(wallOrder(shows).map((show) => show.id)).toEqual([3, 1, 2])
})

test('shows without a poster are left out, and the original array is not changed', () => {
  const shows = [makeShow({ id: 1 }), makeShow({ id: 2, image: null })]
  expect(wallOrder(shows).map((show) => show.id)).toEqual([1])
  expect(shows).toHaveLength(2)
})
