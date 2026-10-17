import type { Show } from '../types/tvmaze'

// מה שמוצג בקיר: רק סדרות עם פוסטר, מהדירוג הגבוה לנמוך. סדרה בלי דירוג נחשבת 0 ויורדת לסוף.
// מחזיר מערך חדש — לא משנה את המערך שקיבל (sort משנה במקום, ולכן קודם filter).
export function wallOrder<T extends Show>(shows: T[]): T[] {
  return shows
    .filter((show) => show.image !== null)
    .sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0))
}
