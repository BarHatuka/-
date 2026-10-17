import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, expect, test, vi } from 'vitest'
import App from './App'
import { defaultAnswers, fakeTvmaze } from './test/shows'

beforeEach(() => {
  vi.stubGlobal('fetch', fakeTvmaze(defaultAnswers))
})

// MemoryRouter: ראוטר שמחזיק את הכתובת בזיכרון במקום בשורת הכתובת, כך שבבדיקה אפשר להתחיל מכל כתובת.
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

test('the wall loads from TVmaze, highest rated first', async () => {
  renderAt('/')

  expect(screen.getByText('טוענים את הסדרות…')).toBeInTheDocument()
  const wall = await screen.findByRole('region', { name: 'כל הסדרות' })
  const items = within(wall).getAllByRole('listitem')
  expect(items[0]).toHaveTextContent('Person of Interest') // 8.8
  expect(items.at(-1)).toHaveTextContent('Death Note') // בלי דירוג — בסוף
})

test('clicking a poster opens the show page, with its cast', async () => {
  const user = userEvent.setup()
  renderAt('/')

  await user.click(await screen.findByRole('link', { name: /Person of Interest/ }))

  expect(await screen.findByRole('heading', { level: 1, name: 'Person of Interest' })).toBeInTheDocument()
  expect(screen.getByText(/שודרה בין 2011 ל-2016 ב-CBS/)).toBeInTheDocument()
  expect(screen.getByText('Michael Emerson')).toBeInTheDocument()
})

test('a show page opened directly loads by itself', async () => {
  renderAt('/shows/2')
  expect(screen.getByText('טוענים את הסדרה…')).toBeInTheDocument()
  expect(await screen.findByRole('heading', { level: 1, name: 'Person of Interest' })).toBeInTheDocument()
})

test('an address that does not exist shows the not-found page', () => {
  renderAt('/xyz')
  expect(screen.getByRole('heading', { name: 'העמוד הזה לא בתוכנית' })).toBeInTheDocument()
})

test('a show that TVmaze does not know (404) shows the not-found page too', async () => {
  renderAt('/shows/999999')
  expect(await screen.findByRole('heading', { name: 'העמוד הזה לא בתוכנית' })).toBeInTheDocument()
})

test('when the network is offline, there is an error and "נסו שוב" loads again', async () => {
  vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'))
  const user = userEvent.setup()
  renderAt('/')

  expect(await screen.findByRole('alert')).toHaveTextContent('לא הצלחנו לטעון את הסדרות')
  await user.click(screen.getByRole('button', { name: 'נסו שוב' }))
  expect(await screen.findByRole('link', { name: /Person of Interest/ })).toBeInTheDocument()
})
