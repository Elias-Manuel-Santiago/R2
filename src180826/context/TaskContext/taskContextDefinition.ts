import { createContext } from 'react'
import type { NewTask, QuickTask, Task, TaskStatus } from '../../types/Task'

export type TaskContextValue = {
  tasks: Task[]
  quickTasks: QuickTask[]
  addTask: (task: NewTask) => Task
  addQuickTask: (task: Task) => boolean
  removeQuickTask: (quickTaskId: string) => void
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  deleteTask: (taskId: string) => void
  clearCompletedTasks: () => void
}

export const TaskContext = createContext<TaskContextValue | null>(null)
