import { beforeEach, expect, test } from 'vitest'
import { makeShow, personOfInterest } from '../test/shows'
import { loadMyList, storeMyList, toSavedShow, toggleShow } from './myList'

beforeEach(() => localStorage.clear())

test('toggleShow adds a show that is not saved, and removes one that is', () => {
  const glee = makeShow({ id: 8, name: 'Glee' })
  const saved = toggleShow([], glee)
  expect(saved.map((show) => show.id)).toEqual([8])
  expect(toggleShow(saved, glee)).toEqual([])
})

test('toggleShow returns a new array and keeps the old one as it was', () => {
  const before: ReturnType<typeof loadMyList> = []
  const after = toggleShow(before, personOfInterest)
  expect(after).not.toBe(before)
  expect(before).toHaveLength(0)
})

test('only the card fields are saved, not the summary or the schedule', () => {
  expect(Object.keys(toSavedShow(personOfInterest)).sort()).toEqual(['genres', 'id', 'image', 'name', 'premiered', 'rating'])
})

test('what is stored comes back after loading, and broken data gives an empty list', () => {
  storeMyList([toSavedShow(personOfInterest)])
  expect(loadMyList()[0].name).toBe('Person of Interest')

  localStorage.setItem('premiere:my-list', '{not json')
  expect(loadMyList()).toEqual([])
})
