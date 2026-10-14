import { Link, useNavigate, useParams } from 'react-router-dom'
import DeleteTaskButton from '../../components/DeleteTaskButton/DeleteTaskButton'
import PageHeading from '../../components/PageHeading/PageHeading'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import { useTasks } from '../../context/TaskContext/useTasks'
import { formatDate, formatDueDate, isDueDateOverdue } from '../../utils/formatDate'
import { normalizeTitle } from '../../utils/normalizeTitle'
import type { TaskStatus } from '../../types/Task'
import '../../components/Button/Button.css'
import './TaskDetailPage.css'

function TaskDetailPage() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { tasks, quickTasks, addQuickTask, updateTaskStatus, deleteTask } = useTasks()
  // El parámetro de la URL identifica la tarea que debe mostrarse.
  const task = tasks.find((currentTask) => currentTask.id === taskId)

  // Una URL válida también puede apuntar a una tarea eliminada o inexistente.
  if (!task) {
    return <section className="missing-task"><span className="missing-task__code">404</span><h1>Tarea no encontrada</h1><p>La tarea que buscás no existe o ya no está disponible.</p><Link className="button" to="/">Volver al inicio</Link></section>
  }

  // Compara títulos normalizados para no duplicar atajos equivalentes.
  const isQuickTask = quickTasks.some(
    (quickTask) => normalizeTitle(quickTask.title) === normalizeTitle(task.title),
  )
  const hasDueDate = Boolean(task.dueDate)
  const canEdit = task.status !== 'completed'

  return (
    <section>
      <PageHeading eyebrow="Detalle" title={task.title} />
      <article className="task-detail">
        <div className="task-detail__meta">
          <div className="task-detail__status">
            <span>Estado</span>
            <StatusBadge status={task.status} />
            <select
              value={task.status}
              onChange={(event) => updateTaskStatus(task.id, event.target.value as TaskStatus)}
              aria-label={`Estado de ${task.title}`}
            >
              <option value="pending">Pendiente</option>
              <option value="in-progress">En proceso</option>
              <option value="completed">Completada</option>
            </select>
          </div>
          <div><span>Creada el</span><strong>{formatDate(task.createdAt)}</strong></div>
          <div className={isDueDateOverdue(task.dueDate) && task.status !== 'completed' ? 'task-detail__due task-detail__due--overdue' : 'task-detail__due'}>
            <span>Fecha de entrega</span><strong>{formatDueDate(task.dueDate, 'long')}</strong>
          </div>
        </div>
        <div className="task-detail__description"><span>Descripción completa</span><p>{task.description}</p></div>
        <div className="task-detail__actions">
          <Link className="button button--secondary" to="/">← Volver a la lista</Link>
          {canEdit && <Link className="button" to={`/tareas/${task.id}/editar`}>Editar tarea</Link>}
          {/* Sólo las tareas sin fecha pueden convertirse en atajos reutilizables. */}
          <button
            className="button button--secondary"
            type="button"
            onClick={() => addQuickTask(task)}
            disabled={hasDueDate || isQuickTask}
            title={hasDueDate ? 'Solo las tareas sin fecha de entrega pueden agregarse como rápidas.' : undefined}
          >
            {hasDueDate
              ? 'No puede asignarse como tarea rapida si tiene fecha de entrega'
              : isQuickTask
                ? '✓ Ya está en tareas rápidas'
                : '⚡ Agregar a tareas rápidas'}
          </button>
          {task.status === 'completed' && (
            <DeleteTaskButton taskTitle={task.title} onDelete={() => { deleteTask(task.id); navigate('/') }} />
          )}
        </div>
      </article>
    </section>
  )
}

export default TaskDetailPage
