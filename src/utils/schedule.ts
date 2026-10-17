import type { ScheduleEntry } from '../types/tvmaze'

export type HourGroup = {
  hour: string // "20:00", או "" לשידורים בלי שעה קבועה
  entries: ScheduleEntry[]
}

// מקבץ את השידורים לפי השעה העגולה: 20:00 ו-20:30 נכנסים שניהם תחת "20:00".
// השעות ממוינות מהמוקדמת למאוחרת, ושידורים בלי שעה יורדים לסוף.
export function groupByHour(entries: ScheduleEntry[]): HourGroup[] {
  const sorted = [...entries].sort((a, b) => sortKey(a.airtime).localeCompare(sortKey(b.airtime)))
  const groups: HourGroup[] = []

  for (const entry of sorted) {
    const hour = entry.airtime ? `${entry.airtime.slice(0, 2)}:00` : ''
    const last = groups.at(-1)
    if (last && last.hour === hour) last.entries.push(entry)
    else groups.push({ hour, entries: [entry] })
  }
  return groups
}

// "" (בלי שעה) צריך לבוא אחרי "23:59", ולכן ממיינים אותו כ-"99:99"
function sortKey(airtime: string): string {
  return airtime || '99:99'
}

// "עונה 2, פרק 5". פרק מיוחד בלי מספר → "עונה 2, פרק מיוחד".
export function describeEpisode(entry: Pick<ScheduleEntry, 'season' | 'number'>): string {
  return entry.number === null ? `עונה ${entry.season}, פרק מיוחד` : `עונה ${entry.season}, פרק ${entry.number}`
}

// "2026-10-17" → "יום שבת, 17 באוקטובר".
// בונים את התאריך מהחלקים שלו, כדי שאזור הזמן של המחשב לא יזיז אותו ביום.
const hebrewDate = new Intl.DateTimeFormat('he', { weekday: 'long', day: 'numeric', month: 'long' })
export function formatAirdate(airdate: string): string {
  const [year, month, day] = airdate.split('-').map(Number)
  return hebrewDate.format(new Date(year, month - 1, day))
}
