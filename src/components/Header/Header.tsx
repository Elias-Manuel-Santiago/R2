import { Link, NavLink } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <Link className="header__brand" to="/" aria-label="Ir al inicio">
        <span aria-hidden="true">✓</span>Tareas
      </Link>
      <nav className="header__nav" aria-label="Navegación principal">
        {/* NavLink agrega la clase active; end limita Inicio a la ruta exacta. */}
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/tareas/nueva">Nueva tarea</NavLink>
      </nav>
    </header>
  )
}

export default Header
