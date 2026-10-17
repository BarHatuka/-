import { useEffect, useState, type ReactNode } from 'react'
import { MyListContext } from '../hooks/useMyList'
import type { Show } from '../types/tvmaze'
import { loadMyList, storeMyList, toggleShow } from '../utils/myList'

type MyListProviderProps = {
  children: ReactNode
}

// מחזיק את "הרשימה שלי" במקום אחד, ומעביר אותה לכל העמודים דרך Context.
export default function MyListProvider({ children }: MyListProviderProps) {
  // פונקציה (ולא קריאה לה): React מריץ אותה רק ברינדור הראשון, כדי לקרוא מ-localStorage פעם אחת.
  const [shows, setShows] = useState<Show[]>(loadMyList)

  // בכל פעם שהרשימה משתנה — שומרים אותה בדפדפן.
  useEffect(() => {
    storeMyList(shows)
  }, [shows])

  const value = {
    shows,
    isSaved: (id: number) => shows.some((show) => show.id === id),
    toggle: (show: Show) => setShows((current) => toggleShow(current, show)),
  }

  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>
}
