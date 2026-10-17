import { useParams } from 'react-router'
import { showUrl } from '../api/tvmaze'
import CastList from '../components/CastList'
import StatusMessage from '../components/StatusMessage'
import { useFetch } from '../hooks/useFetch'
import type { ShowWithCast } from '../types/tvmaze'
import { describeBroadcast, formatList, formatRating, formatRuntime, htmlToText } from '../utils/format'
import { genreLabel, languageLabel } from '../utils/labels'
import NotFoundPage from './NotFoundPage'
import './ShowPage.css'

export default function ShowPage() {
  // /shows/2 → id = "2". מה שמגיע מהכתובת הוא תמיד מחרוזת.
  const { id = '' } = useParams()
  // רק ספרות. על /shows/abc לא שולחים בקשה בכלל.
  const isValidId = /^\d+$/.test(id)

  // העמוד טוען את הסדרה בעצמו, לפי המזהה בכתובת — ולכן הוא עובד גם בכניסה ישירה ואחרי רענון.
  const { state, retry } = useFetch<ShowWithCast>(isValidId ? showUrl(id) : null)

  if (!isValidId) return <NotFoundPage />
  if (state.status === 'loading') return <StatusMessage type="loading" text="טוענים את הסדרה…" />
  if (state.status === 'error') {
    if (state.notFound) return <NotFoundPage />
    return <StatusMessage type="error" title="לא הצלחנו לטעון את הסדרה" details={state.message} onRetry={retry} />
  }

  const show = state.data

  const rating = formatRating(show.rating.average)
  const runtime = formatRuntime(show)

  return (
    <article className="show-page">
      {show.image && <img className="show-page__poster" src={show.image.original} alt={`הפוסטר של ${show.name}`} />}

      <div className="show-page__info">
        <h1 className="show-page__name" dir="ltr">
          {show.name}
        </h1>
        <p>{rating ? `דירוג ${rating} מתוך 10, לפי צופי TVmaze` : 'עוד אין דירוג צופים'}</p>
        <p>{describeBroadcast(show)}</p>

        <dl className="show-page__facts">
          {show.genres.length > 0 && (
            <>
              <dt>ז'אנר</dt>
              <dd>{formatList(show.genres.map(genreLabel))}</dd>
            </>
          )}
          {runtime && (
            <>
              <dt>אורך פרק</dt>
              <dd>{runtime}</dd>
            </>
          )}
          {show.language && (
            <>
              <dt>שפה</dt>
              <dd>{languageLabel(show.language)}</dd>
            </>
          )}
        </dl>

        {show.summary && (
          <p className="show-page__summary" dir="ltr" lang="en">
            {htmlToText(show.summary)}
          </p>
        )}

        <CastList cast={show._embedded.cast} />

        <p className="show-page__links">
          <a href={show.url} target="_blank" rel="noreferrer">
            לעמוד הסדרה ב-TVmaze
          </a>
          {show.officialSite && (
            <a href={show.officialSite} target="_blank" rel="noreferrer">
              לאתר הרשמי
            </a>
          )}
        </p>
      </div>
    </article>
  )
}
