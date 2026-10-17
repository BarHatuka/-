import { Link, NavLink, Outlet } from 'react-router'
import ScrollToTop from './ScrollToTop'
import './Layout.css'

// המסגרת של כל העמודים: כותרת עם ניווט למעלה, קרדיט למטה, והעמוד עצמו באמצע.
// <Outlet /> הוא המקום שבו React Router מצייר את העמוד שמתאים לכתובת.
export default function Layout() {
  return (
    <div className="layout">
      <ScrollToTop />
      <header className="site-header">
        <Link to="/" className="site-header__title">
          פרמיירה
        </Link>
        <nav aria-label="ניווט ראשי">
          {/* NavLink מוסיף class="active" לקישור של העמוד הנוכחי. end: רק "/" בדיוק, לא כל כתובת שמתחילה ב-"/" */}
          <NavLink to="/" end>
            כל הסדרות
          </NavLink>
          <NavLink to="/my-list">הרשימה שלי</NavLink>
          <NavLink to="/today">היום בטלוויזיה</NavLink>
        </nav>
      </header>

      <main className="layout__main">
        <Outlet />
      </main>

      <footer className="site-footer">
        המידע והתמונות מ-<a href="https://www.tvmaze.com">TVmaze</a>, ברישיון{' '}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.
      </footer>
    </div>
  )
}
