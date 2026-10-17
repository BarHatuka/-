import type { Show } from '../types/tvmaze'

// "הרשימה שלי" נשמרת בדפדפן (localStorage), כדי שתישאר גם אחרי רענון של הדף.
// שומרים את שדות הכרטיס של כל סדרה (שם, פוסטר, שנה, דירוג), כך שהעמוד /my-list מוצג בלי בקשה לשרת.
const STORAGE_KEY = 'premiere:my-list'

// רק השדות שכרטיס צריך — לא את התקציר, השחקנים וכל השאר.
export function toSavedShow(show: Show): Show {
  const { id, name, genres, premiered, rating, image } = show
  return { id, name, genres, premiered, rating, image }
}

// קורא את הרשימה ששמרנו. אם אין כזאת, או שהמידע פגום — מתחילים מרשימה ריקה.
export function loadMyList(): Show[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? (saved as Show[]) : []
  } catch {
    return []
  }
}

export function storeMyList(shows: Show[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shows))
  } catch {
    // גלישה פרטית או אחסון מלא: הרשימה עובדת, רק לא תישמר לפעם הבאה.
  }
}

// מוסיף את הסדרה לסוף הרשימה אם היא לא שם, ומוריד אותה אם היא כבר שם.
// מחזיר מערך חדש ולא משנה את הישן — כך React מזהה שה-state השתנה.
export function toggleShow(shows: Show[], show: Show): Show[] {
  return shows.some((saved) => saved.id === show.id)
    ? shows.filter((saved) => saved.id !== show.id)
    : [...shows, toSavedShow(show)]
}
