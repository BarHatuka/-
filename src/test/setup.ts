import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// מנקים את המסך אחרי כל בדיקה, כדי שבדיקה אחת לא תראה את מה שהקודמת ציירה.
afterEach(() => cleanup())
