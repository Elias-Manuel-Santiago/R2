import { useEffect, useId, useRef, useState } from 'react'
import './DeleteTaskButton.css'

type DeleteTaskButtonProps = {
  taskTitle: string
  onDelete: () => void
  compact?: boolean
  triggerLabel?: string
  dialogTitle?: string
  description?: string
  confirmLabel?: string
  icon?: string
}

function DeleteTaskButton({
  taskTitle,
  onDelete,
  compact = false,
  triggerLabel = 'Eliminar tarea',
  dialogTitle = '¿Eliminar tarea?',
  description = `“${taskTitle}” se quitará de la lista de forma permanente.`,
  confirmLabel = 'Sí, eliminar',
  icon = '×',
}: DeleteTaskButtonProps) {
  // El estado React y la referencia mantienen sincronizado el diálogo nativo.
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    // showModal activa el fondo bloqueado y el manejo de foco del navegador.
    if (isOpen && dialog && !dialog.open) dialog.showModal()
  }, [isOpen])

  function closeDialog() {
    dialogRef.current?.close()
    setIsOpen(false)
  }

  function confirmDelete() {
    // Se cierra primero para que el componente pueda desmontarse después sin problemas.
    closeDialog()
    onDelete()
  }

  return (
    <>
      <button
        className={`delete-task-trigger${compact ? ' delete-task-trigger--compact' : ''}`}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={compact ? `${triggerLabel}: ${taskTitle}` : undefined}
      >
        <span aria-hidden="true">{icon}</span>{compact ? null : ` ${triggerLabel}`}
      </button>

      <dialog
        className="delete-dialog"
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={(event) => {
          // Escape usa la misma rutina de cierre que el botón Cancelar.
          event.preventDefault()
          closeDialog()
        }}
        onClose={() => setIsOpen(false)}
      >
        <div className="delete-dialog__mark" aria-hidden="true">!</div>
        <h2 id={titleId}>{dialogTitle}</h2>
        <p>{description}</p>
        <div className="delete-dialog__actions">
          <button className="button button--danger" type="button" onClick={confirmDelete}>{confirmLabel}</button>
          <button className="button button--secondary" type="button" onClick={closeDialog}>Cancelar</button>
        </div>
      </dialog>
    </>
  )
}

export default DeleteTaskButton
