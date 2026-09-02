import { useEffect, useState } from 'react'
import '../ThemeButton/ThemeButton.css'
import './ScrollTopButton.css'

function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    function updateVisibility() {
      // Se oculta cerca del inicio para no mostrar una acción innecesaria.
      setIsVisible(window.scrollY > 160)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    // El cleanup evita dejar listeners activos al desmontar el layout.
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  if (!isVisible) return null

  return (
    <button
      className="theme-button scroll-top-button"
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver al inicio de la página"
      title="Volver arriba"
    >
      <svg className="theme-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 11 6-6 6 6" />
        <path d="M12 19V5" />
      </svg>
    </button>
  )
}

export default ScrollTopButton
