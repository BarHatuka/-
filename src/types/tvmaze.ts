// השדות של סדרה מ-TVmaze שהאפליקציה משתמשת בהם.
// ה-API שולח הרבה יותר — TypeScript מכיר רק את מה שכתוב כאן, וזה מה שמותר לנו לקרוא.
export type Show = {
  id: number
  name: string
  genres: string[]
  premiered: string | null // "2011-09-22", או null לסדרה שעוד לא עלתה
  rating: { average: number | null } // null כשאין מספיק מדרגים
  image: { medium: string; original: string } | null // יש סדרות בלי פוסטר
}
