import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { showUrl } from '../api/tvmaze'
import CastList from '../components/CastList'
import Icon from '../components/Icon'
import Poster from '../components/Poster'
import SaveButton from '../components/SaveButton'
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
      <BackLink />

      <div className="show-page__layout">
        <div className="show-page__poster">
          {show.image ? (
            <Poster src={show.image.original} alt={`הפוסטר של ${show.name}`} fallbackText={show.name} />
          ) : (
            <span className="poster poster--missing" dir="ltr">
              {show.name}
            </span>
          )}
        </div>

        <div className="show-page__info">
          <h1 className="show-page__name" dir="ltr">
            {show.name}
          </h1>

          <p className="show-page__rating">
            {rating ? (
              <>
                <Icon name="star" filled />
                <span className="show-page__rating-value">{rating}</span>
                <span className="show-page__rating-label">מתוך 10, לפי צופי TVmaze</span>
              </>
            ) : (
              <span className="show-page__rating-label">עוד אין דירוג צופים</span>
            )}
          </p>

          <p className="show-page__broadcast">{describeBroadcast(show)}</p>

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

          <div className="show-page__actions">
            <SaveButton show={show} />
            <p className="show-page__links">
              <a href={show.url} target="_blank" rel="noreferrer">
                לעמוד הסדרה ב-TVmaze
                <Icon name="external" />
              </a>
              {show.officialSite && (
                <a href={show.officialSite} target="_blank" rel="noreferrer">
                  לאתר הרשמי
                  <Icon name="external" />
                </a>
              )}
            </p>
          </div>

          <CastList cast={show._embedded.cast} />
        </div>
      </div>
    </article>
  )
}

// "חזרה": אם הגענו מתוך האתר — חוזרים צעד אחד בהיסטוריה, כך שהקיר חוזר עם החיפוש והסינון שהיו בו.
// אם נכנסו ישר לכתובת (key === 'default' = העמוד הראשון בהיסטוריה) — אין לאן לחזור, ולכן קישור לקיר.
function BackLink() {
  const location = useLocation()
  const navigate = useNavigate()

  if (location.key === 'default') {
    return (
      <Link to="/" className="show-page__back">
        <Icon name="back" />
        לכל הסדרות
      </Link>
    )
  }

  return (
    <button type="button" className="show-page__back" onClick={() => navigate(-1)}>
      <Icon name="back" />
      חזרה
    </button>
  )
}
