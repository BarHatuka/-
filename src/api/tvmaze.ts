// כל הכתובות של TVmaze במקום אחד. API חינמי, בלי מפתח, ופתוח לדפדפן (CORS).
const BASE_URL = 'https://api.tvmaze.com'

// עמוד 0 של הקטלוג: בערך 240 סדרות, כל אחת עם כל השדות שהקיר צריך.
export const SHOWS_URL = `${BASE_URL}/shows`

// סדרה אחת, יחד עם השחקנים שלה (embed=cast חוסך בקשה נוספת).
export function showUrl(id: string): string {
  return `${BASE_URL}/shows/${id}?embed=cast`
}

// לוח השידורים של היום בארה"ב: כל הפרקים שמשודרים היום, וכל אחד עם הסדרה שלו.
export const SCHEDULE_URL = `${BASE_URL}/schedule?country=US`

// שגיאה מיוחדת ל-404, כדי שעמוד הסדרה יציג "לא נמצא" ולא "תקלה ברשת".
export class NotFoundError extends Error {}

// fetch לא זורק שגיאה על 404 או 500 — רק כשאין רשת. לכן בודקים את הסטטוס בעצמנו.
// T הוא הטיפוס שאנחנו מצפים לקבל. TypeScript לא יכול לבדוק את התשובה בזמן ריצה, אז אנחנו מצהירים עליו.
export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (response.status === 404) throw new NotFoundError(`Not found: ${url}`)
  if (!response.ok) throw new Error(`TVmaze responded with status ${response.status}`)

  return (await response.json()) as T
}
