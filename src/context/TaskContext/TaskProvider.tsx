import { useState, type ReactNode } from 'react'
import type { NewTask, QuickTask, Task, TaskStatus, TaskUpdates } from '../../types/Task'
import { normalizeTitle } from '../../utils/normalizeTitle'
import { TaskContext } from './taskContextDefinition'

const STORAGE_KEY = 'lista-de-tareas'
const QUICK_TASKS_STORAGE_KEY = 'tareas-rapidas'

// Se usa al migrar tareas antiguas que todavía no tenían fecha de entrega.
function getDefaultDueDate(createdAt: string) {
  const dueDate = new Date(createdAt)
  dueDate.setDate(dueDate.getDate() + 7)
  return dueDate.toISOString().slice(0, 10)
}

// Recupera las tareas y adapta datos guardados por versiones anteriores.
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
    // Si el almacenamiento está dañado, la aplicación puede iniciar vacía.
    return []
  }
}

// Los atajos se guardan aparte porque no son tareas activas.
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
  // Pasar funciones a useState evita leer localStorage en cada renderizado.
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [quickTasks, setQuickTasks] = useState<QuickTask[]>(loadQuickTasks)

  function addTask(taskData: NewTask) {
    // Los campos de sistema se generan aquí para que todas las altas sean consistentes.
    const newTask: Task = {
      ...taskData,
      description: taskData.description.trim() || 'Sin descripción',
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    }

    setTasks((currentTasks) => {
      // React y localStorage reciben exactamente la misma lista actualizada.
      const updatedTasks = [...currentTasks, newTask]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
      return updatedTasks
    })

    return newTask
  }

  function updateTaskStatus(taskId: string, status: TaskStatus) {
    setTasks((currentTasks) => {
      // Se crea un objeto nuevo sólo para la tarea que coincide con el ID.
      const updatedTasks = currentTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
      return updatedTasks
    })
  }

  function updateTask(taskId: string, taskData: TaskUpdates) {
    setTasks((currentTasks) => {
      const updatedTasks = currentTasks.map((task) => {
        // Las tareas completadas se conservan como registro y no se pueden editar.
        if (task.id !== taskId || task.status === 'completed') return task

        return {
          ...task,
          ...taskData,
          title: taskData.title.trim(),
          description: taskData.description.trim() || 'Sin descripción',
        }
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
      return updatedTasks
    })
  }

  function addQuickTask(task: Task) {
    // Los atajos representan tareas reutilizables sin una fecha específica.
    if (task.dueDate) return false

    // La comparación normalizada evita duplicados por mayúsculas, acentos o espacios.
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
      // Sólo los elementos completados se pueden borrar, incluso si se invoca esta función fuera de la interfaz.
      const updatedTasks = currentTasks.filter((task) => task.id !== taskId || task.status !== 'completed')
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

  function replaceTaskData(importedTasks: Task[], importedQuickTasks: QuickTask[]) {
    // La importación se confirma antes de llegar aquí y reemplaza ambos conjuntos juntos.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(importedTasks))
    localStorage.setItem(QUICK_TASKS_STORAGE_KEY, JSON.stringify(importedQuickTasks))
    setTasks(importedTasks)
    setQuickTasks(importedQuickTasks)
  }

  return (
    // Cualquier descendiente puede leer el estado o ejecutar estas operaciones.
    <TaskContext.Provider value={{
      tasks,
      quickTasks,
      addTask,
      addQuickTask,
      removeQuickTask,
      updateTaskStatus,
      updateTask,
      deleteTask,
      clearCompletedTasks,
      replaceTaskData,
    }}>
      {children}
    </TaskContext.Provider>
  )
}
