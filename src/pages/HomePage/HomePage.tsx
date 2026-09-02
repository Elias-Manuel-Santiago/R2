import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PageHeading from '../../components/PageHeading/PageHeading'
import TaskCard from '../../components/TaskCard/TaskCard'
import DeleteTaskButton from '../../components/DeleteTaskButton/DeleteTaskButton'
import { useTasks } from '../../context/TaskContext/useTasks'
import type { Task } from '../../types/Task'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import TaskDataControls from '../../components/TaskDataControls/TaskDataControls'
import { formatDueDate, isDueDateOverdue } from '../../utils/formatDate'
import '../../components/Button/Button.css'
import './HomePage.css'

function HomePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null)
  const highlightTimeoutRef = useRef<number | null>(null)
  const highlightFrameRef = useRef<number | null>(null)
  const { tasks, updateTaskStatus, deleteTask, clearCompletedTasks } = useTasks()
  // Cada sección deriva de la misma lista, por lo que siempre refleja el estado actual.
  const pendingTasks = tasks.filter((task) => task.status === 'pending')
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress')
  const completedTasks = tasks.filter((task) => task.status === 'completed')
  // Las fechas YYYY-MM-DD pueden ordenarse correctamente como texto.
  const upcomingTasks = tasks
    .filter((task) => task.status !== 'completed' && Boolean(task.dueDate))
    .sort((firstTask, secondTask) => firstTask.dueDate.localeCompare(secondTask.dueDate))

  useEffect(() => () => {
    // Cancela animaciones pendientes si el usuario abandona la página.
    if (highlightTimeoutRef.current !== null) window.clearTimeout(highlightTimeoutRef.current)
    if (highlightFrameRef.current !== null) window.cancelAnimationFrame(highlightFrameRef.current)
  }, [])

  useEffect(() => {
    // Otra página puede pedir que se localice una tarea enviando su ID en la navegación.
    const taskId = (location.state as { highlightTaskId?: string } | null)?.highlightTaskId
    if (!taskId) return

    const frameId = window.requestAnimationFrame(() => {
      const taskElement = document.getElementById(`task-${taskId}`)
      taskElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      taskElement?.focus({ preventScroll: true })
      setHighlightedTaskId(taskId)
      highlightTimeoutRef.current = window.setTimeout(() => setHighlightedTaskId(null), 900)
      // Se consume el state para que el efecto no se repita al volver con el navegador.
      navigate(location.pathname, { replace: true, state: null })
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [location.pathname, location.state, navigate])

  function scrollToTask(taskId: string) {
    // La lista de entregas desplaza y enfoca la tarjeta relacionada.
    const taskElement = document.getElementById(`task-${taskId}`)
    taskElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    taskElement?.focus({ preventScroll: true })

    if (highlightTimeoutRef.current !== null) window.clearTimeout(highlightTimeoutRef.current)
    if (highlightFrameRef.current !== null) window.cancelAnimationFrame(highlightFrameRef.current)

    setHighlightedTaskId(null)
    // Dos frames garantizan que la clase se quite antes de reiniciar su animación.
    highlightFrameRef.current = window.requestAnimationFrame(() => {
      highlightFrameRef.current = window.requestAnimationFrame(() => {
        setHighlightedTaskId(taskId)
        highlightTimeoutRef.current = window.setTimeout(() => setHighlightedTaskId(null), 900)
      })
    })
  }

  function renderTasks(sectionTasks: Task[], emptyMessage: string) {
    // Reutiliza el mismo render para las tres columnas del tablero.
    if (sectionTasks.length === 0) return <p className="task-section__empty">{emptyMessage}</p>

    return (
      <ul className="task-list">
        {sectionTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={updateTaskStatus}
            onDelete={deleteTask}
            isHighlighted={highlightedTaskId === task.id}
          />
        ))}
      </ul>
    )
  }

  return (
    <section>
      <PageHeading
        eyebrow={`${tasks.length} ${tasks.length === 1 ? 'tarea' : 'tareas'}`}
        title="Mis tareas"
        description=""
        actions={(
          <div className="home-heading-actions">
            <TaskDataControls />
            <Link className="button" to="/tareas/nueva">+ Nueva tarea</Link>
          </div>
        )}
      />

      <section className="due-tasks" aria-labelledby="due-tasks-heading">
        <div className="due-tasks__heading">
          <div>
            <span>Próximas entregas</span>
            <h2 id="due-tasks-heading">Fechas de entrega</h2>
          </div>
          <strong>{upcomingTasks.length}</strong>
        </div>
        {/* Las tareas vencidas siguen visibles, pero reciben un estilo de alerta. */}
        {upcomingTasks.length > 0 ? (
          <ul className="due-tasks__list">
            {upcomingTasks.map((task) => {
              const isOverdue = isDueDateOverdue(task.dueDate)
              return (
                <li key={task.id}>
                  <button className={`due-task${isOverdue ? ' due-task--overdue' : ''}`} type="button" onClick={() => scrollToTask(task.id)}>
                    <span className="due-task__title">{task.title}</span>
                    <StatusBadge status={task.status} />
                    <time dateTime={task.dueDate}>{isOverdue ? 'Atrasada · ' : ''}{formatDueDate(task.dueDate)}</time>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : <p className="due-tasks__empty">No hay entregas activas.</p>}
      </section>

      <div className="task-board">
        <section className="task-section" aria-labelledby="pending-heading">
          <div className="task-section__heading">
            <h2 id="pending-heading">Pendientes</h2>
            <span>{pendingTasks.length}</span>
          </div>
          {renderTasks(pendingTasks, 'No hay tareas pendientes.')}
        </section>

        <section className="task-section" aria-labelledby="progress-heading">
          <div className="task-section__heading">
            <h2 id="progress-heading">En proceso</h2>
            <span>{inProgressTasks.length}</span>
          </div>
          {renderTasks(inProgressTasks, 'No hay tareas en proceso.')}
        </section>

        {/* details permite plegar las completadas sin agregar otro estado React. */}
        <details className="completed-section">
          <summary>
            <span>✓ Completadas</span>
            <strong>{completedTasks.length}</strong>
          </summary>
          {completedTasks.length > 0 && (
            <div className="completed-section__actions">
              <DeleteTaskButton
                taskTitle="tareas completadas"
                onDelete={clearCompletedTasks}
                triggerLabel="Limpiar completadas"
                dialogTitle="¿Limpiar completadas?"
                description={`Se eliminarán ${completedTasks.length} ${completedTasks.length === 1 ? 'tarea completada' : 'tareas completadas'} de forma permanente.`}
                confirmLabel="Sí, limpiar"
                icon="⌫"
              />
            </div>
          )}
          {renderTasks(completedTasks, 'Todavía no hay tareas completadas.')}
        </details>
      </div>

    </section>
  )
}

export default HomePage
