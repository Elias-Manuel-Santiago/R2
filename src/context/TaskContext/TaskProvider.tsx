import { useState, type ReactNode } from 'react'
import type { NewTask, QuickTask, Task, TaskStatus } from '../../types/Task'
import { normalizeTitle } from '../../utils/normalizeTitle'
import { TaskContext } from './taskContextDefinition'

const STORAGE_KEY = 'lista-de-tareas'
const QUICK_TASKS_STORAGE_KEY = 'tareas-rapidas'

function getDefaultDueDate(createdAt: string) {
  const dueDate = new Date(createdAt)
  dueDate.setDate(dueDate.getDate() + 7)
  return dueDate.toISOString().slice(0, 10)
}

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY)
    if (!savedTasks) return []

    const parsedTasks = JSON.parse(savedTasks) as Array<Task & { completed?: boolean }>
    return parsedTasks.map(({ completed, ...task }) => ({
      ...task,
      description: task.description?.trim() || 'Sin descripción',
      dueDate: task.dueDate === undefined ? getDefaultDueDate(task.createdAt) : task.dueDate,
      status: task.status ?? (completed ? 'completed' : 'pending'),
    }))
  } catch {
    return []
  }
}

function loadQuickTasks() {
  try {
    const savedQuickTasks = localStorage.getItem(QUICK_TASKS_STORAGE_KEY)
    if (!savedQuickTasks) return []

    const parsedQuickTasks = JSON.parse(savedQuickTasks) as QuickTask[]
    return parsedQuickTasks
      .filter((quickTask) => quickTask.id && quickTask.title?.trim())
      .map((quickTask) => ({
        ...quickTask,
        description: quickTask.description?.trim() || 'Sin descripción',
      }))
  } catch {
    return []
  }
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [quickTasks, setQuickTasks] = useState<QuickTask[]>(loadQuickTasks)

  function addTask(taskData: NewTask) {
    const newTask: Task = {
      ...taskData,
      description: taskData.description.trim() || 'Sin descripción',
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    }

    setTasks((currentTasks) => {
      const updatedTasks = [...currentTasks, newTask]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
      return updatedTasks
    })

    return newTask
  }

  function updateTaskStatus(taskId: string, status: TaskStatus) {
    setTasks((currentTasks) => {
      const updatedTasks = currentTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
      return updatedTasks
    })
  }

  function addQuickTask(task: Task) {
    if (task.dueDate) return false

    if (quickTasks.some((quickTask) => normalizeTitle(quickTask.title) === normalizeTitle(task.title))) {
      return false
    }

    const newQuickTask: QuickTask = {
      id: crypto.randomUUID(),
      title: task.title,
      description: task.description,
    }

    setQuickTasks((currentQuickTasks) => {
      const updatedQuickTasks = [...currentQuickTasks, newQuickTask]
      localStorage.setItem(QUICK_TASKS_STORAGE_KEY, JSON.stringify(updatedQuickTasks))
      return updatedQuickTasks
    })
    return true
  }

  function removeQuickTask(quickTaskId: string) {
    setQuickTasks((currentQuickTasks) => {
      const updatedQuickTasks = currentQuickTasks.filter((quickTask) => quickTask.id !== quickTaskId)
      localStorage.setItem(QUICK_TASKS_STORAGE_KEY, JSON.stringify(updatedQuickTasks))
      return updatedQuickTasks
    })
  }

  function deleteTask(taskId: string) {
    setTasks((currentTasks) => {
      const updatedTasks = currentTasks.filter((task) => task.id !== taskId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
      return updatedTasks
    })
  }

  function clearCompletedTasks() {
    setTasks((currentTasks) => {
      const updatedTasks = currentTasks.filter((task) => task.status !== 'completed')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
      return updatedTasks
    })
  }

  return (
    <TaskContext.Provider value={{
      tasks,
      quickTasks,
      addTask,
      addQuickTask,
      removeQuickTask,
      updateTaskStatus,
      deleteTask,
      clearCompletedTasks,
    }}>
      {children}
    </TaskContext.Provider>
  )
}
