import { createContext, useContext } from 'react'
import type { Show } from '../types/tvmaze'

// מה שכל רכיב יכול לקבל מ"הרשימה שלי": הסדרות, בדיקה אם סדרה שמורה, ושמירה או הסרה.
export type MyList = {
  shows: Show[]
  isSaved: (id: number) => boolean
  toggle: (show: Show) => void
}

// Context: דרך להעביר מידע לכל רכיב בעץ בלי להעביר props דרך כל שכבה באמצע.
// הכותרת (המספר ליד "הרשימה שלי"), עמוד הסדרה ועמוד הרשימה — כולם קוראים מאותו מקום.
export const MyListContext = createContext<MyList | null>(null)

export function useMyList(): MyList {
  const myList = useContext(MyListContext)
  if (!myList) throw new Error('useMyList must be used inside <MyListProvider>')
  return myList
}
