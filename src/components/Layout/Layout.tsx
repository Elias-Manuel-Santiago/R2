import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import ScrollTopButton from '../ScrollTopButton/ScrollTopButton'
import ThemeButton from '../ThemeButton/ThemeButton'
import './Layout.css'

function Layout() {
  return (
    <div className="layout">
      <Header />
      {/* React Router reemplaza Outlet por la página correspondiente a la URL. */}
      <main className="layout__main"><Outlet /></main>
      {/* Estas acciones flotantes permanecen disponibles en todas las páginas. */}
      <ScrollTopButton />
      <ThemeButton />
    </div>
  )
}

export default Layout
