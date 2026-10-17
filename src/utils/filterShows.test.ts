import { describe, expect, test } from 'vitest'
import { makeShow, testShows } from '../test/shows'
import { countGenres, describeNoResults, filterShows, normalize } from './filterShows'

const names = (shows: { name: string }[]) => shows.map((show) => show.name)

describe('filterShows', () => {
  test('without a search or a genre, every show stays', () => {
    expect(filterShows(testShows, { query: '', genre: null })).toHaveLength(testShows.length)
  })

  test('search ignores upper and lower case', () => {
    expect(names(filterShows(testShows, { query: 'GLEE', genre: null }))).toEqual(['Glee'])
  })

  test('search ignores accents, so "pokemon" finds "Pokémon"', () => {
    const shows = [makeShow({ id: 1, name: 'Pokémon' }), makeShow({ id: 2, name: 'Glee' })]
    expect(names(filterShows(shows, { query: 'pokemon', genre: null }))).toEqual(['Pokémon'])
  })

  test('genre and search work together', () => {
    expect(names(filterShows(testShows, { query: 'new', genre: 'Comedy' }))).toEqual(['New Girl'])
  })
})

test('normalize removes accents, case and outer spaces', () => {
  expect(normalize('  Café ')).toBe('cafe')
})

test('countGenres counts every genre, the most common first', () => {
  const shows = [
    makeShow({ id: 1, genres: ['Drama', 'Crime'] }),
    makeShow({ id: 2, genres: ['Drama'] }),
    makeShow({ id: 3, genres: ['Comedy'] }),
  ]
  expect(countGenres(shows)).toEqual([
    { name: 'Drama', count: 2 },
    { name: 'Comedy', count: 1 },
    { name: 'Crime', count: 1 },
  ])
})

describe('describeNoResults', () => {
  test('a Hebrew search explains that the names are in English', () => {
    expect(describeNoResults({ query: ' חברים ', genre: null }, 240)).toBe(
      'שמות הסדרות כאן באנגלית, כמו בשידור המקורי. נסו לכתוב את "חברים" באנגלית.',
    )
  })

  test('an English search says how many shows were searched, and mentions the genre only when one is picked', () => {
    expect(describeNoResults({ query: 'friends', genre: null }, 240)).toBe(
      'לא מצאנו סדרה עם "friends" בשם. החיפוש עובר על 240 הסדרות שבאתר, לא על כל TVmaze.',
    )
    expect(describeNoResults({ query: 'zzz', genre: 'Comedy' }, 240)).toContain("בשם בז'אנר הזה.")
  })

  test('without a search, it talks about the filter', () => {
    expect(describeNoResults({ query: '', genre: 'Comedy' }, 240)).toBe('אין כאן סדרות שמתאימות לסינון שבחרתם.')
  })
})
