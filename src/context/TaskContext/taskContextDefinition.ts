import { createContext } from 'react'
import type { NewTask, QuickTask, Task, TaskStatus } from '../../types/Task'

// Contrato público del estado compartido y de todas sus operaciones.
export type TaskContextValue = {
  tasks: Task[]
  quickTasks: QuickTask[]
  addTask: (task: NewTask) => Task
  addQuickTask: (task: Task) => boolean
  removeQuickTask: (quickTaskId: string) => void
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  deleteTask: (taskId: string) => void
  clearCompletedTasks: () => void
  replaceTaskData: (tasks: Task[], quickTasks: QuickTask[]) => void
}

// El valor real se asigna en TaskProvider.
export const TaskContext = createContext<TaskContextValue | null>(null)
