import ShowList from './components/ShowList'
import sampleShows from './data/sample-shows.json'
import type { Show } from './types/tvmaze'
import './App.css'

// בשלב הזה הסדרות מגיעות מקובץ מקומי: 8 סדרות שהועתקו מתשובה אמיתית של TVmaze.
// TypeScript בודק כאן שהקובץ מתאים לטיפוס Show. במשימה 3 הן יגיעו מה-API עצמו.
const shows: Show[] = sampleShows

export default function App() {
  return (
    <div className="app">
      <h1>פרמיירה</h1>
      <ShowList shows={shows} />
    </div>
  )
}
