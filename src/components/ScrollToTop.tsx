import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

// בלי זה, לחיצה על פוסטר בתחתית הקיר פותחת את עמוד הסדרה באמצע הגלילה.
// במעבר לעמוד חדש גוללים לראש הדף. ב"אחורה" (POP) משאירים לדפדפן להחזיר את המקום שבו היינו.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}
