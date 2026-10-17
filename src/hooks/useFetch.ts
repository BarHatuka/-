import { useEffect, useState } from 'react'
import { fetchJson, NotFoundError } from '../api/tvmaze'

// שלושת המצבים של בקשה. TypeScript מכריח לבדוק את status לפני שנוגעים ב-data או ב-message.
export type FetchState<T> =
  | { status: 'loading' }
  | { status: 'error'; notFound: boolean; message: string }
  | { status: 'ready'; data: T }

// התשובה האחרונה שהגיעה, יחד עם הכתובת והניסיון שהיא שייכת אליהם
type Answer<T> = { url: string; attempt: number; state: FetchState<T> }

// תשובות שכבר הגיעו, לפי כתובת. כשחוזרים לקיר מעמוד של סדרה, הסדרות מוצגות מיד, בלי לטעון שוב.
const cache = new Map<string, unknown>()

// לבדיקות בלבד: כל בדיקה מתחילה בלי זיכרון של הבדיקה הקודמת.
export function clearFetchCache() {
  cache.clear()
}

// טוען JSON מכתובת ומחזיר את מצב הבקשה, ועוד פונקציה לניסיון חוזר.
// url = null: אין מה לטעון (למשל מזהה סדרה לא תקין בכתובת).
export function useFetch<T>(url: string | null) {
  const [attempt, setAttempt] = useState(0) // עולה ב-1 בכל "נסו שוב", וזה מריץ את ה-effect מחדש
  const [answer, setAnswer] = useState<Answer<T> | null>(null)

  useEffect(() => {
    if (url === null || cache.has(url)) return

    // אם הכתובת השתנתה (או שהרכיב ירד מהמסך) לפני שהתשובה חזרה — מתעלמים ממנה.
    let ignore = false

    fetchJson<T>(url)
      .then((data) => {
        cache.set(url, data)
        if (!ignore) setAnswer({ url, attempt, state: { status: 'ready', data } })
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error)
        const notFound = error instanceof NotFoundError
        if (!ignore) setAnswer({ url, attempt, state: { status: 'error', notFound, message } })
      })

    return () => {
      ignore = true
    }
  }, [url, attempt])

  // המצב מחושב בכל רינדור, ולא נשמר ב-state נוסף:
  // יש בזיכרון → מוכן. יש תשובה לכתובת ולניסיון הנוכחיים → היא. אחרת → עדיין טוענים.
  let state: FetchState<T> = { status: 'loading' }
  if (url !== null && cache.has(url)) {
    state = { status: 'ready', data: cache.get(url) as T }
  } else if (answer && answer.url === url && answer.attempt === attempt) {
    state = answer.state
  }

  return { state, retry: () => setAttempt((count) => count + 1) }
}
