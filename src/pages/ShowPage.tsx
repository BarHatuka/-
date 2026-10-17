import { useParams } from 'react-router'
import sampleShows from '../data/sample-shows.json'
import type { ShowDetails } from '../types/tvmaze'
import { describeBroadcast, formatList, formatRating, formatRuntime, htmlToText } from '../utils/format'
import { genreLabel, languageLabel } from '../utils/labels'
import NotFoundPage from './NotFoundPage'
import './ShowPage.css'

const shows: ShowDetails[] = sampleShows

export default function ShowPage() {
  // /shows/2 → id = "2". מה שמגיע מהכתובת הוא תמיד מחרוזת, ולכן Number(...)
  const { id } = useParams()
  const show = shows.find((item) => item.id === Number(id))

  if (!show) return <NotFoundPage />

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
