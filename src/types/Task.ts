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

export type NewTask = Pick<Task, 'title' | 'description' | 'dueDate'>

export type QuickTask = Pick<Task, 'title' | 'description'> & {
  id: string
}
