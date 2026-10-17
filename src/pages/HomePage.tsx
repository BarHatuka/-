import ShowList from '../components/ShowList'
import sampleShows from '../data/sample-shows.json'
import type { Show } from '../types/tvmaze'

// בשלב הזה הסדרות מגיעות מקובץ מקומי: 8 סדרות שהועתקו מתשובה אמיתית של TVmaze.
// TypeScript בודק כאן שהקובץ מתאים לטיפוס Show. במשימה 3 הן יגיעו מה-API עצמו.
const shows: Show[] = sampleShows

export default function HomePage() {
  return (
    <section aria-label="כל הסדרות">
      <ShowList shows={shows} />
    </section>
  )
}
