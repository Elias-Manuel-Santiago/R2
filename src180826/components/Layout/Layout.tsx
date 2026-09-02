import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import ScrollTopButton from '../ScrollTopButton/ScrollTopButton'
import ThemeButton from '../ThemeButton/ThemeButton'
import './Layout.css'

function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main"><Outlet /></main>
      <ScrollTopButton />
      <ThemeButton />
    </div>
  )
}

export default Layout
