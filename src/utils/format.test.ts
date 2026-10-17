import { describe, expect, test } from 'vitest'
import { makeShow, personOfInterest } from '../test/shows'
import { describeBroadcast, formatList, formatRating, formatRuntime, getYear, htmlToText } from './format'

describe('getYear', () => {
  test('takes the year from a TVmaze date', () => {
    expect(getYear('2011-09-22')).toBe('2011')
  })

  test('returns an empty string when there is no date', () => {
    expect(getYear(null)).toBe('')
  })
})

describe('formatRating', () => {
  test('always shows one digit after the point', () => {
    expect(formatRating(8.8)).toBe('8.8')
    expect(formatRating(8)).toBe('8.0')
  })

  test('returns null when the show has no rating', () => {
    expect(formatRating(null)).toBeNull()
  })
})

describe('describeBroadcast', () => {
  test('a show that ended: years, channel and time slot (Person of Interest, from the real data)', () => {
    expect(describeBroadcast(personOfInterest)).toBe(
      'שודרה בין 2011 ל-2016 ב-CBS, בימי שלישי בשעה 22:00 (לפי שעון הרשת).',
    )
  })

  test('a show that is still running', () => {
    const show = makeShow({
      status: 'Running',
      premiered: '2014-01-12',
      ended: null,
      network: { name: 'HBO' },
      schedule: { time: '21:00', days: ['Sunday'] },
    })
    expect(describeBroadcast(show)).toBe('משודרת מאז 2014 ב-HBO, בימי ראשון בשעה 21:00 (לפי שעון הרשת).')
  })

  test('a streaming show with no fixed time slot', () => {
    const show = makeShow({
      premiered: '2013-04-19',
      ended: '2015-10-23',
      network: null,
      webChannel: { name: 'Netflix' },
      schedule: { time: '', days: [] },
    })
    expect(describeBroadcast(show)).toBe('שודרה בין 2013 ל-2015 ב-Netflix.')
  })

  test('several days are joined the Hebrew way', () => {
    const show = makeShow({ schedule: { time: '', days: ['Monday', 'Tuesday', 'Wednesday'] } })
    expect(describeBroadcast(show)).toContain('בימי שני, שלישי ורביעי')
  })

  test('a show that has not aired yet', () => {
    const show = makeShow({ status: 'In Development', premiered: null, ended: null, schedule: { time: '', days: [] } })
    expect(describeBroadcast(show)).toBe('עוד לא עלתה לשידור.')
  })
})

describe('small helpers', () => {
  test('formatList joins with commas and "ו"', () => {
    expect(formatList(['דרמה', 'פשע', 'מתח'])).toBe('דרמה, פשע ומתח')
  })

  test('formatRuntime falls back to averageRuntime', () => {
    expect(formatRuntime({ runtime: null, averageRuntime: 45 })).toBe('כ-45 דקות')
    expect(formatRuntime({ runtime: null, averageRuntime: null })).toBeNull()
  })

  test('htmlToText removes tags and decodes entities', () => {
    expect(htmlToText('<p><b>Glee</b> is fun &amp; loud</p>')).toBe('Glee is fun & loud')
    expect(htmlToText(null)).toBe('')
  })
})
