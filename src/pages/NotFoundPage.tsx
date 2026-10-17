import { Link } from 'react-router'

// מופיע בכל כתובת שאין לה עמוד, וגם כשמבקשים סדרה שלא קיימת.
export default function NotFoundPage() {
  return (
    <section>
      <h1>העמוד הזה לא בתוכנית</h1>
      <p>אולי הקישור השתנה, ואולי הסדרה ירדה מהלוח.</p>
      <Link to="/">חזרה לכל הסדרות</Link>
    </section>
  )
}
