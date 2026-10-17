import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { clearFetchCache } from '../hooks/useFetch'

// ב-jsdom אין גלילה אמיתית. ScrollToTop קורא ל-scrollTo, אז מחליפים אותו בפונקציה ריקה.
window.scrollTo = vi.fn()

// אחרי כל בדיקה: מנקים את המסך, את הזיכרון של useFetch, את localStorage ואת ה-fetch המדומה,
// כדי שבדיקה אחת לא תראה את מה שהקודמת השאירה.
afterEach(() => {
  cleanup()
  clearFetchCache()
  localStorage.clear()
  vi.unstubAllGlobals()
})
