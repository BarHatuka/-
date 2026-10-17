import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { expect, test } from 'vitest'
import sampleShows from '../data/sample-shows.json'
import ShowList from './ShowList'

test('shows a card for every show, with its name, year and rating', () => {
  // כל כרטיס הוא Link, ו-Link צריך ראוטר מסביבו
  render(
    <MemoryRouter>
      <ShowList shows={sampleShows} />
    </MemoryRouter>,
  )

  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(8)

  const personOfInterest = items[1]
  expect(within(personOfInterest).getByRole('heading')).toHaveTextContent('Person of Interest')
  expect(personOfInterest).toHaveTextContent('2011')
  expect(personOfInterest).toHaveTextContent('דירוג 8.8')
  expect(within(personOfInterest).getByRole('link')).toHaveAttribute('href', '/shows/2')
})
