import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageHeading from '../../components/PageHeading/PageHeading'
import { useTasks } from '../../context/TaskContext/useTasks'
import { normalizeTitle } from '../../utils/normalizeTitle'
import '../../components/Button/Button.css'
import '../CreateTaskPage/CreateTaskPage.css'

function EditTaskPage() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { tasks, updateTask } = useTasks()
  const task = tasks.find((currentTask) => currentTask.id === taskId)
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description === 'Sin descripción' ? '' : task?.description ?? '')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')

  if (!task) {
    return <section className="missing-task"><span className="missing-task__code">404</span><h1>Tarea no encontrada</h1><p>La tarea que buscás no existe o ya no está disponible.</p><Link className="button" to="/">Volver al inicio</Link></section>
  }

  if (task.status === 'completed') {
    return <section className="missing-task"><h1>La tarea está completada</h1><p>Las tareas completadas no se pueden modificar.</p><Link className="button" to={`/tareas/${task.id}`}>Volver al detalle</Link></section>
  }

  const activeTaskId = task.id
  const normalizedTitle = normalizeTitle(title)
  const duplicateTask = normalizedTitle
    ? tasks.find((currentTask) => currentTask.id !== activeTaskId && currentTask.status !== 'completed' && normalizeTitle(currentTask.title) === normalizedTitle)
    : undefined

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (duplicateTask) return

    updateTask(activeTaskId, { title, description, dueDate })
    navigate(`/tareas/${activeTaskId}`)
  }

  return (
    <section>
      <PageHeading eyebrow="Editar entrada" title="Modificar tarea" description="Actualizá los datos de esta tarea pendiente o en proceso." />
      <form className="task-form task-form--edit" onSubmit={handleSubmit}>
        <label className="form-field form-field--title">
          <span>Título</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={80}
            aria-invalid={Boolean(duplicateTask)}
            aria-describedby={duplicateTask ? 'duplicate-title-message' : undefined}
            required
          />
          <small>Máximo 80 caracteres.</small>
          {duplicateTask && <p className="duplicate-title-message" id="duplicate-title-message" role="alert">Ya existe otra tarea activa con este título.</p>}
        </label>
        <label className="form-field">
          <span>Descripción (opcional)</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={6} maxLength={600} />
          <small>Si la dejás vacía, se mostrará “Sin descripción”. Máximo 600 caracteres.</small>
        </label>
        <label className="form-field">
          <span>Fecha de entrega (opcional)</span>
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </label>
        <div className="task-form__actions">
          <button className="button" type="submit" disabled={Boolean(duplicateTask)}>Guardar cambios →</button>
          <Link className="button button--secondary" to={`/tareas/${activeTaskId}`}>Cancelar</Link>
        </div>
      </form>
    </section>
  )
}

export default EditTaskPage
