import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DeleteTaskButton from '../../components/DeleteTaskButton/DeleteTaskButton'
import PageHeading from '../../components/PageHeading/PageHeading'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import { useTasks } from '../../context/TaskContext/useTasks'
import type { QuickTask } from '../../types/Task'
import { formatShortDate } from '../../utils/formatDate'
import { normalizeTitle } from '../../utils/normalizeTitle'
import '../../components/Button/Button.css'
import './CreateTaskPage.css'

function CreateTaskPage() {
  const navigate = useNavigate()
  const { tasks, quickTasks, addTask, removeQuickTask } = useTasks()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [duplicateQuickTaskId, setDuplicateQuickTaskId] = useState<string | null>(null)
  const [duplicateExistingTaskId, setDuplicateExistingTaskId] = useState<string | null>(null)
  const duplicateTimeoutRef = useRef<number | null>(null)
  const duplicateFrameRef = useRef<number | null>(null)
  // Se normaliza una vez por render para reutilizarlo en búsqueda y validación.
  const normalizedTitle = normalizeTitle(title)
  // A partir de dos caracteres se muestran como máximo cinco coincidencias relevantes.
  const matchingTasks = normalizedTitle.length >= 2
    ? tasks
      .filter((task) => normalizeTitle(task.title).includes(normalizedTitle))
      .sort((firstTask, secondTask) => {
        const firstTitle = normalizeTitle(firstTask.title)
        const secondTitle = normalizeTitle(secondTask.title)
        if (firstTitle === normalizedTitle) return -1
        if (secondTitle === normalizedTitle) return 1
        if (firstTitle.startsWith(normalizedTitle) && !secondTitle.startsWith(normalizedTitle)) return -1
        if (secondTitle.startsWith(normalizedTitle) && !firstTitle.startsWith(normalizedTitle)) return 1
        return firstTitle.localeCompare(secondTitle, 'es')
      })
      .slice(0, 5)
    : []
  // Sólo una coincidencia exacta y todavía activa bloquea la creación.
  const duplicateTask = normalizedTitle
    ? tasks.find((task) => task.status !== 'completed' && normalizeTitle(task.title) === normalizedTitle)
    : undefined

  useEffect(() => () => {
    // Limpia avisos y animaciones diferidas al salir de la página.
    if (duplicateTimeoutRef.current !== null) window.clearTimeout(duplicateTimeoutRef.current)
    if (duplicateFrameRef.current !== null) window.cancelAnimationFrame(duplicateFrameRef.current)
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (duplicateTask) return
    // addTask devuelve el ID recién creado para abrir inmediatamente su detalle.
    const newTask = addTask({ title: title.trim(), description: description.trim(), dueDate })
    navigate(`/tareas/${newTask.id}`)
  }

  function createQuickTask(quickTask: QuickTask) {
    // Los atajos tampoco pueden crear otra copia de una tarea activa.
    const duplicate = tasks.find(
      (task) => task.status !== 'completed' && normalizeTitle(task.title) === normalizeTitle(quickTask.title),
    )

    if (duplicate) {
      // Reinicia el aviso aunque el usuario pulse varias veces el mismo atajo.
      if (duplicateTimeoutRef.current !== null) window.clearTimeout(duplicateTimeoutRef.current)
      if (duplicateFrameRef.current !== null) window.cancelAnimationFrame(duplicateFrameRef.current)
      setDuplicateQuickTaskId(null)
      setDuplicateExistingTaskId(null)
      // Los dos frames permiten volver a disparar la animación CSS.
      duplicateFrameRef.current = window.requestAnimationFrame(() => {
        duplicateFrameRef.current = window.requestAnimationFrame(() => {
          setDuplicateQuickTaskId(quickTask.id)
          setDuplicateExistingTaskId(duplicate.id)
          duplicateTimeoutRef.current = window.setTimeout(() => {
            setDuplicateQuickTaskId(null)
            setDuplicateExistingTaskId(null)
          }, 10000)
        })
      })
      return
    }

    // Una tarea rápida siempre nace pendiente y sin fecha de entrega.
    const newTask = addTask({
      title: quickTask.title,
      description: quickTask.description,
      dueDate: '',
    })
    navigate(`/tareas/${newTask.id}`)
  }

  return (
    <section>
      <PageHeading eyebrow="Nueva entrada" title="Crear tarea" description="Completá los datos. Podrás verla en la lista apenas la guardes." />
      <div className="create-task-layout">
        <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-field form-field--title">
          <label htmlFor="task-title">Título</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej.: Estudiar React Router"
            maxLength={80}
            aria-invalid={Boolean(duplicateTask)}
            aria-describedby={duplicateTask ? 'duplicate-title-message' : 'title-help'}
            autoComplete="off"
            required
          />
          <small>Máximo 80 caracteres.</small>
          {matchingTasks.length > 0 && (
            // Las sugerencias permiten revisar tareas parecidas antes de guardar.
            <section className="task-suggestions" aria-labelledby="task-suggestions-heading">
              <div className="task-suggestions__heading">
                <strong id="task-suggestions-heading">Tareas parecidas</strong>
                <span>Revisá antes de crear otra</span>
              </div>
              <ul>
                {matchingTasks.map((task) => {
                  const isBlockingMatch = task.status !== 'completed' && normalizeTitle(task.title) === normalizedTitle
                  return (
                    <li key={task.id}>
                      <Link className={`task-suggestion${isBlockingMatch ? ' task-suggestion--exact' : ''}`} to={`/tareas/${task.id}`}>
                        <span className="task-suggestion__title">{task.title}</span>
                        <StatusBadge status={task.status} />
                        <time dateTime={task.createdAt}>Creada el {formatShortDate(task.createdAt)}</time>
                        <span className="task-suggestion__arrow" aria-hidden="true">→</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
          {duplicateTask && (
            <p className="duplicate-title-message" id="duplicate-title-message" role="alert">
              Esta tarea ya existe. Podés abrirla desde la lista superior.
            </p>
          )}
          <span className="visually-hidden" id="title-help">Ingresá un título para buscar tareas parecidas.</span>
        </div>
        <label className="form-field">
          <span>Descripción (opcional)</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Escribí toda la información necesaria..." rows={6} maxLength={600} />
          <small>Si la dejás vacía, se mostrará “Sin descripción”. Máximo 600 caracteres.</small>
        </label>
        <label className="form-field">
          <span>Fecha de entrega (opcional)</span>
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          <small>Podés agregar el día límite ahora o dejar la tarea sin fecha.</small>
        </label>
        <div className="task-form__actions">
          <button className="button" type="submit" disabled={Boolean(duplicateTask)}>Guardar tarea →</button>
          <Link className="button button--secondary" to="/">Cancelar</Link>
        </div>
        </form>

        <aside className="quick-tasks" aria-labelledby="quick-tasks-heading">
          <div className="quick-tasks__heading">
            <span>Atajos</span>
            <h2 id="quick-tasks-heading">Tareas rápidas</h2>
            <p>Creá una nueva tarea pendiente con un solo toque y sin fecha de entrega.</p>
          </div>

          {/* Los atajos se administran de forma independiente de las tareas creadas. */}
          {quickTasks.length > 0 ? (
            <ul className="quick-tasks__list">
              {quickTasks.map((quickTask) => {
                const isDuplicate = duplicateQuickTaskId === quickTask.id
                return (
                  <li className={`quick-task${isDuplicate ? ' quick-task--duplicate' : ''}`} key={quickTask.id}>
                    <div className="quick-task__top">
                      <h3>{quickTask.title}</h3>
                      <DeleteTaskButton
                        taskTitle={quickTask.title}
                        onDelete={() => removeQuickTask(quickTask.id)}
                        compact
                        triggerLabel="Eliminar tarea rápida"
                        dialogTitle="¿Eliminar tarea rápida?"
                        description={`“${quickTask.title}” se quitará de tus atajos. Las tareas ya creadas no se modificarán.`}
                        confirmLabel="Sí, eliminar"
                      />
                    </div>
                    <p>{quickTask.description}</p>
                    {isDuplicate && (
                      <div className="quick-task__duplicate-notice">
                        <strong className="quick-task__duplicate-message" role="alert">Ya existe</strong>
                        <button
                          className="quick-task__duplicate-link"
                          type="button"
                          onClick={() => navigate('/', { state: { highlightTaskId: duplicateExistingTaskId } })}
                          aria-label={`Ver la tarea existente ${quickTask.title}`}
                          title="Ver la tarea existente"
                        >
                          {/* El inicio usa este ID para desplazar y resaltar la tarea existente. */}
                          ?
                        </button>
                      </div>
                    )}
                    <button className="button quick-task__create" type="button" onClick={() => createQuickTask(quickTask)}>
                      + Crear tarea
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="quick-tasks__empty">Ve a los detalles de una tarea y agrégala como tarea rápida para que aparezca aquí.</p>
          )}
        </aside>
      </div>
    </section>
  )
}

export default CreateTaskPage
