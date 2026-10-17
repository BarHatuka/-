import type { Show } from '../types/tvmaze'

export type ShowFilters = {
  query: string
  genre: string | null // null = כל הז'אנרים
}

// מחזיר רק את הסדרות שמתאימות לחיפוש ולז'אנר.
// פונקציה "טהורה": לא נוגעת ב-state, בכתובת או במסך — ולכן קל לבדוק אותה לבד.
export function filterShows<T extends Show>(shows: T[], { query, genre }: ShowFilters): T[] {
  const search = normalize(query)

  return shows.filter((show) => {
    const matchesName = normalize(show.name).includes(search)
    const matchesGenre = genre === null || show.genres.includes(genre)
    return matchesName && matchesGenre
  })
}

// " Pokémon" → "pokemon": בלי אותיות גדולות, בלי סימנים מעל אותיות, ובלי רווחים בקצוות.
// כך "cafe" מוצא גם "Café".
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export type GenreCount = { name: string; count: number }

// כמה סדרות יש בכל ז'אנר: [{ name: 'Drama', count: 140 }, ...], מהנפוץ לנדיר.
export function countGenres(shows: Show[]): GenreCount[] {
  const counts: Record<string, number> = {}
  for (const show of shows) {
    for (const genre of show.genres) {
      counts[genre] = (counts[genre] ?? 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

// מה כותבים כשאין אף סדרה להציג. ההודעה תלויה במה שהמשתמש עשה, כדי שיידע מה לשנות.
// total = כמה סדרות נטענו. החיפוש עובר רק עליהן, לא על כל הקטלוג של TVmaze (ראו "Not now" ב-PRD).
export function describeNoResults({ query, genre }: ShowFilters, total: number): string {
  const search = query.trim()

  // השמות ב-TVmaze באנגלית, אז חיפוש בעברית לא ימצא כלום. עדיף להגיד את זה מאשר סתם "אין תוצאות".
  if (/[א-ת]/.test(search)) {
    return `שמות הסדרות כאן באנגלית, כמו בשידור המקורי. נסו לכתוב את "${search}" באנגלית.`
  }
  if (search) {
    const inGenre = genre === null ? '' : " בז'אנר הזה"
    return `לא מצאנו סדרה עם "${search}" בשם${inGenre}. החיפוש עובר על ${total} הסדרות שבאתר, לא על כל TVmaze.`
  }
  return 'אין כאן סדרות שמתאימות לסינון שבחרתם.'
}
