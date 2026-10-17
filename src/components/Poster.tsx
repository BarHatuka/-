import { useState } from 'react'
import './Poster.css'

type PosterProps = {
  src: string
  alt: string // ריק בכרטיס, שבו השם כתוב ממילא מתחת
  fallbackText: string // מה כותבים במקום התמונה, אם היא לא נטענה
}

// תמונת פוסטר שנכנסת בעדינות כשהיא נטענת, ואם היא נכשלת — מציגה את שם הסדרה במקומה.
// ה-state כאן מקומי: רק הפוסטר עצמו צריך לדעת אם התמונה שלו נטענה.
export default function Poster({ src, alt, fallbackText }: PosterProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')

  if (status === 'failed') {
    // בלי alt — מסתירים מקורא המסך, כדי שלא יקריא את השם פעמיים
    return alt ? (
      <span className="poster poster--missing" role="img" aria-label={alt}>
        <span dir="ltr">{fallbackText}</span>
      </span>
    ) : (
      <span className="poster poster--missing" aria-hidden="true">
        <span dir="ltr">{fallbackText}</span>
      </span>
    )
  }

  return (
    <img
      className="poster"
      data-status={status}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('failed')}
    />
  )
}
