import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { expect, test } from 'vitest'
import App from './App'

// MemoryRouter: ראוטר שמחזיק את הכתובת בזיכרון במקום בשורת הכתובת, כך שבבדיקה אפשר להתחיל מכל כתובת.
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

test('clicking a poster opens the show page', async () => {
  const user = userEvent.setup()
  renderAt('/')

  await user.click(screen.getByRole('link', { name: /Person of Interest/ }))

  expect(screen.getByRole('heading', { level: 1, name: 'Person of Interest' })).toBeInTheDocument()
  expect(screen.getByText(/שודרה בין 2011 ל-2016 ב-CBS/)).toBeInTheDocument()
})

test('an address that does not exist shows the not-found page', () => {
  renderAt('/xyz')
  expect(screen.getByRole('heading', { name: 'העמוד הזה לא בתוכנית' })).toBeInTheDocument()
})

test('a show id that does not exist shows the not-found page too', () => {
  renderAt('/shows/999999')
  expect(screen.getByRole('heading', { name: 'העמוד הזה לא בתוכנית' })).toBeInTheDocument()
})
