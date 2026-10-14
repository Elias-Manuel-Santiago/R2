import { Link } from 'react-router-dom'
import type { Task, TaskStatus } from '../../types/Task'
import { formatDueDate, isDueDateOverdue } from '../../utils/formatDate'
import DeleteTaskButton from '../DeleteTaskButton/DeleteTaskButton'
import StatusBadge from '../StatusBadge/StatusBadge'
import './TaskCard.css'

type TaskCardProps = {
  task: Task
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onDelete: (taskId: string) => void
  isHighlighted?: boolean
}

function TaskCard({ task, onStatusChange, onDelete, isHighlighted = false }: TaskCardProps) {
  // La tarjeta muestra un resumen; el texto completo queda disponible en el detalle.
  const descriptionPreview = task.description.length > 80
    ? `${task.description.slice(0, 80)}…`
    : task.description

  return (
    <li id={`task-${task.id}`} tabIndex={-1}>
      {/* El estado y el resaltado agregan clases que controlan color y animación. */}
      <article className={`task-card task-card--${task.status}${isHighlighted ? ' task-card--due-highlight' : ''}`}>
        <div className="task-card__top">
          <StatusBadge status={task.status} />
          <div className="task-card__actions">
            {task.status === 'completed' && (
              <DeleteTaskButton taskTitle={task.title} onDelete={() => onDelete(task.id)} compact />
            )}
            <Link className="task-card__arrow" to={`/tareas/${task.id}`} aria-label={`Ver ${task.title}`}>→</Link>
          </div>
        </div>
        <Link className="task-card__content" to={`/tareas/${task.id}`}>
          <h3>{task.title}</h3>
          <p>{descriptionPreview}</p>
          {task.dueDate ? (
            // Una tarea completada conserva la fecha, pero deja de marcarse como atrasada.
            <time className={isDueDateOverdue(task.dueDate) && task.status !== 'completed' ? 'task-card__due task-card__due--overdue' : 'task-card__due'} dateTime={task.dueDate}>
              Entrega: {formatDueDate(task.dueDate)}
            </time>
          ) : <span className="task-card__due">Entrega: Sin fecha</span>}
        </Link>
        <label className="task-card__status">
          <span>Estado</span>
          {/* El padre recibe el ID junto con el nuevo estado seleccionado. */}
          <select
            value={task.status}
            onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
            aria-label={`Estado de ${task.title}`}
          >
            <option value="pending">Pendiente</option>
            <option value="in-progress">En proceso</option>
            <option value="completed">Completada</option>
          </select>
        </label>
      </article>
    </li>
  )
}

export default TaskCard
