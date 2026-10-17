import { expect, test } from 'vitest'
import { makeEntry } from '../test/shows'
import { describeEpisode, formatAirdate, groupByHour } from './schedule'

test('entries are grouped by the hour, earliest first, and entries without a time go last', () => {
  const groups = groupByHour([
    makeEntry({ id: 1, airtime: '21:30' }),
    makeEntry({ id: 2, airtime: '' }),
    makeEntry({ id: 3, airtime: '20:00' }),
    makeEntry({ id: 4, airtime: '21:00' }),
  ])

  expect(groups.map((group) => group.hour)).toEqual(['20:00', '21:00', ''])
  expect(groups[1].entries.map((entry) => entry.id)).toEqual([4, 1])
})

test('describeEpisode names the season and the episode', () => {
  expect(describeEpisode({ season: 2, number: 5 })).toBe('עונה 2, פרק 5')
  expect(describeEpisode({ season: 2, number: null })).toBe('עונה 2, פרק מיוחד')
})

test('formatAirdate writes the day in Hebrew', () => {
  expect(formatAirdate('2026-10-17')).toBe('יום שבת, 17 באוקטובר')
})
