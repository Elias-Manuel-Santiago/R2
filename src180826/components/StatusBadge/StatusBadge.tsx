import './StatusBadge.css'
import type { TaskStatus } from '../../types/Task'

const statusConfig: Record<TaskStatus, { icon: string; label: string }> = {
  pending: { icon: '○', label: 'Pendiente' },
  'in-progress': { icon: '◐', label: 'En proceso' },
  completed: { icon: '✓', label: 'Completada' },
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status]

  return (
    <span className={`status-badge status-badge--${status}`}>
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  )
}

export default StatusBadge
