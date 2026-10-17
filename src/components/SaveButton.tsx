import { useMyList } from '../hooks/useMyList'
import type { Show } from '../types/tvmaze'
import Icon from './Icon'
import './SaveButton.css'

type SaveButtonProps = {
  show: Show
}

// הטקסט אומר בדיוק מה יקרה בלחיצה: שמירה, או הסרה.
export default function SaveButton({ show }: SaveButtonProps) {
  const myList = useMyList()
  const saved = myList.isSaved(show.id)

  return (
    <button type="button" className={saved ? 'save-button save-button--saved' : 'save-button'} onClick={() => myList.toggle(show)}>
      <Icon name="heart" filled={saved} />
      {saved ? 'הסרה מהרשימה שלי' : 'שמירה לרשימה שלי'}
    </button>
  )
}
