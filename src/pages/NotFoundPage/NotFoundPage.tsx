import { Link } from 'react-router-dom'
import '../../components/Button/Button.css'
import '../TaskDetailPage/TaskDetailPage.css'

function NotFoundPage() {
  return <section className="missing-task"><span className="missing-task__code">404</span><h1>Página no encontrada</h1><p>La dirección ingresada no corresponde a ninguna página.</p><Link className="button" to="/">Volver al inicio</Link></section>
}

export default NotFoundPage
