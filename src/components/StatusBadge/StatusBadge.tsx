import './StatusBadge.css'
import type { TaskStatus } from '../../types/Task'

// Relaciona cada valor interno con el texto que ve el usuario.
const statusConfig: Record<TaskStatus, { label: string }> = {
  pending: { label: 'Pendiente' },
  'in-progress': { label: 'En proceso' },
  completed: { label: 'Completada' },
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status]

  return (
    <span className={`status-badge status-badge--${status}`}>
      {config.label}
    </span>
  )
}

export default StatusBadge
