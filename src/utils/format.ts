// פונקציות קטנות שהופכות שדות מ-TVmaze לטקסט שמוצג על המסך.
// אין בהן React, ולכן אפשר לבדוק אותן לבד (format.test.ts).

// "2011-09-22" → "2011". בלי תאריך → מחרוזת ריקה.
export function getYear(date: string | null): string {
  return date ? date.slice(0, 4) : ''
}

// 8.8 → "8.8", ו-8 → "8.0", כדי שכל הדירוגים ייראו באותו אורך. בלי דירוג → null.
export function formatRating(average: number | null): string | null {
  return average === null ? null : average.toFixed(1)
}
