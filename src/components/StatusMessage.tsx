import './StatusMessage.css'

// שני המצבים שלפני שיש מידע: טוענים, או שגיאה עם כפתור לניסיון חוזר.
// הטיפוס הוא "או-או": עם type="error" חייבים לתת גם onRetry, ועם "loading" אין צורך.
type StatusMessageProps =
  | { type: 'loading'; text: string; posters?: boolean }
  | { type: 'error'; title: string; details: string; onRetry: () => void }

export default function StatusMessage(props: StatusMessageProps) {
  if (props.type === 'loading') {
    return (
      <div className="status status--loading" role="status">
        <p className="status__text">{props.text}</p>
        {/* פוסטרים "ריקים" שמראים איפה הקיר יופיע. רשימה קבועה שלא משתנה, ולכן key לפי מיקום תקין כאן */}
        {props.posters && (
          <ul className="status__skeleton" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <li key={index} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="status status--error" role="alert">
      <h2 className="status__title">{props.title}</h2>
      <p className="status__text">החיבור ל-TVmaze נכשל. בדקו שיש חיבור לאינטרנט ונסו שוב.</p>
      <p className="status__details" dir="ltr">
        {props.details}
      </p>
      <button type="button" className="button button--primary" onClick={props.onRetry}>
        נסו שוב
      </button>
    </div>
  )
}
