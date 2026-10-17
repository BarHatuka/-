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

test('the genre and the search come from the address, so a shared link opens the same filtered wall', async () => {
  renderAt('/?genre=Comedy&q=new')

  const wall = await screen.findByRole('region', { name: 'כל הסדרות' })
  const items = within(wall).getAllByRole('listitem')
  expect(items).toHaveLength(1)
  expect(items[0]).toHaveTextContent('New Girl')
  expect(screen.getByRole('searchbox', { name: 'חיפוש סדרה לפי שם' })).toHaveValue('new')
  expect(screen.getByRole('button', { name: /קומדיה/ })).toHaveAttribute('aria-pressed', 'true')
})

test('a search with no results explains why, and "הצגת כל הסדרות" brings the wall back', async () => {
  const user = userEvent.setup()
  renderAt('/?q=friends')

  expect(await screen.findByText(/לא מצאנו סדרה עם "friends" בשם/)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'הצגת כל הסדרות' }))
  expect(within(screen.getByRole('region', { name: 'כל הסדרות' })).getAllByRole('listitem')).toHaveLength(6)
})

test('a saved show is still in "הרשימה שלי" after a refresh, and can be removed', async () => {
  const user = userEvent.setup()
  const { unmount } = renderAt('/shows/2')

  await user.click(await screen.findByRole('button', { name: 'שמירה לרשימה שלי' }))
  expect(screen.getByRole('button', { name: 'הסרה מהרשימה שלי' })).toBeInTheDocument()

  // "רענון": מורידים את האפליקציה ומעלים אותה מחדש. localStorage נשאר.
  unmount()
  renderAt('/my-list')
  expect(screen.getByRole('link', { name: /Person of Interest/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /הרשימה שלי 1/ })).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'הסרת Person of Interest מהרשימה' }))
  expect(screen.getByText(/הרשימה שלך עוד ריקה/)).toBeInTheDocument()
})

test('"היום בטלוויזיה" lists today\'s shows by hour, and a show opens its page', async () => {
  const user = userEvent.setup()
  renderAt('/')

  await user.click(screen.getByRole('link', { name: 'היום בטלוויזיה' }))

  const hours = await screen.findAllByRole('heading', { level: 2 })
  expect(hours.map((hour) => hour.textContent)).toEqual(['20:00', '22:00'])
  expect(screen.getByText(/עונה 5, פרק 13/)).toBeInTheDocument()

  await user.click(screen.getByRole('link', { name: 'Person of Interest' }))
  expect(await screen.findByRole('heading', { level: 1, name: 'Person of Interest' })).toBeInTheDocument()
})
