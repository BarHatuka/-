// השדות של סדרה מ-TVmaze שהאפליקציה משתמשת בהם.
// ה-API שולח הרבה יותר — TypeScript מכיר רק את מה שכתוב כאן, וזה מה שמותר לנו לקרוא.

// מה שכרטיס בקיר צריך
export type Show = {
  id: number
  name: string
  genres: string[]
  premiered: string | null // "2011-09-22", או null לסדרה שעוד לא עלתה
  rating: { average: number | null } // null כשאין מספיק מדרגים
  image: { medium: string; original: string } | null // יש סדרות בלי פוסטר
}

// רשת טלוויזיה (CBS) או שירות סטרימינג (Netflix)
export type Channel = {
  name: string
}

// מה שעמוד של סדרה צריך: כל שדות הכרטיס, ועוד
export type ShowDetails = Show & {
  status: string // "Running", "Ended" ועוד
  ended: string | null
  network: Channel | null // לסדרות סטרימינג אין network, יש webChannel
  webChannel: Channel | null
  schedule: { time: string; days: string[] }
  runtime: number | null
  averageRuntime: number | null
  language: string | null
  summary: string | null // HTML, למשל "<p><b>Glee</b> is…</p>"
  url: string
  officialSite: string | null
}
