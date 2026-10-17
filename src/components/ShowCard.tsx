import type { Show } from '../types/tvmaze'
import { formatRating, getYear } from '../utils/format'
import './ShowCard.css'

type ShowCardProps = {
  show: Show
}

export default function ShowCard({ show }: ShowCardProps) {
  const rating = formatRating(show.rating.average)

  return (
    <article className="show-card">
      <div className="show-card__poster">
        {/* alt ריק: השם כתוב ממש מתחת, וקורא מסך לא צריך לשמוע אותו פעמיים */}
        {show.image ? <img src={show.image.medium} alt="" loading="lazy" /> : <span dir="ltr">{show.name}</span>}
      </div>
      <h3 className="show-card__name" dir="ltr">
        {show.name}
      </h3>
      <p className="show-card__meta">
        <span>{getYear(show.premiered)}</span>
        {rating && <span>דירוג {rating}</span>}
      </p>
    </article>
  )
}
