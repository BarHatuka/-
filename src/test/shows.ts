import type { ShowDetails } from '../types/tvmaze'

// סדרה לבדיקות, במבנה של TVmaze. כל בדיקה משנה רק את השדות שחשובים לה.
// Partial<ShowDetails>: אותו טיפוס, אבל כל השדות בו אופציונליים.
export function makeShow(overrides: Partial<ShowDetails> = {}): ShowDetails {
  return {
    id: 1,
    url: 'https://www.tvmaze.com/shows/1/test',
    name: 'Test Show',
    language: 'English',
    genres: ['Drama'],
    status: 'Ended',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2010-01-01',
    ended: '2012-01-01',
    officialSite: null,
    schedule: { time: '21:00', days: ['Monday'] },
    rating: { average: 7 },
    network: { name: 'ABC' },
    webChannel: null,
    image: {
      medium: 'https://static.tvmaze.com/test-medium.jpg',
      original: 'https://static.tvmaze.com/test-original.jpg',
    },
    summary: '<p>A test summary.</p>',
    ...overrides,
  }
}
