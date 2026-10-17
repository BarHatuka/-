import { SHOWS_URL } from '../api/tvmaze'
import ShowList from '../components/ShowList'
import StatusMessage from '../components/StatusMessage'
import { useFetch } from '../hooks/useFetch'
import type { Show } from '../types/tvmaze'
import { wallOrder } from '../utils/shows'

export default function HomePage() {
  const { state, retry } = useFetch<Show[]>(SHOWS_URL)

  if (state.status === 'loading') return <StatusMessage type="loading" text="טוענים את הסדרות…" />
  if (state.status === 'error') {
    return <StatusMessage type="error" title="לא הצלחנו לטעון את הסדרות" details={state.message} onRetry={retry} />
  }

  return (
    <section aria-label="כל הסדרות">
      <ShowList shows={wallOrder(state.data)} />
    </section>
  )
}
