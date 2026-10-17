import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import MyListProvider from './components/MyListProvider'
import HomePage from './pages/HomePage'
import MyListPage from './pages/MyListPage'
import NotFoundPage from './pages/NotFoundPage'
import ShowPage from './pages/ShowPage'
import TodayPage from './pages/TodayPage'

// מפת הכתובות של האפליקציה. כל Route מחבר כתובת לעמוד.
// כל העמודים יושבים בתוך Layout, ולכן הכותרת והניווט מופיעים בכולם.
// MyListProvider עוטף הכול, כדי שכל עמוד יוכל לקרוא ולשנות את "הרשימה שלי".
export default function App() {
  return (
    <MyListProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shows/:id" element={<ShowPage />} />
          <Route path="my-list" element={<MyListPage />} />
          <Route path="today" element={<TodayPage />} />
          {/* "*" תופס כל כתובת שלא התאימה לאף נתיב למעלה */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </MyListProvider>
  )
}
