import { useContext } from 'react'
import { TaskContext } from './taskContextDefinition'

export function useTasks() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTasks debe utilizarse dentro de TaskProvider')
  }

  return context
}
