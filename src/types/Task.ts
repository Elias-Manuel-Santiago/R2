export type TaskStatus = 'pending' | 'in-progress' | 'completed'

/** Modelo compartido por todas las pantallas de la aplicación. */
export type Task = {
  id: string
  title: string
  description: string
  createdAt: string
  dueDate: string
  status: TaskStatus
}

// Datos que completa el usuario; el proveedor genera el resto de los campos.
export type NewTask = Pick<Task, 'title' | 'description' | 'dueDate'>

// Los datos que se pueden modificar sin alterar los campos de sistema ni el estado.
export type TaskUpdates = NewTask

// Un atajo sólo conserva la información necesaria para volver a crear una tarea.
export type QuickTask = Pick<Task, 'title' | 'description'> & {
  id: string
}
