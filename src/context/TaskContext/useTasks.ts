import { useContext } from 'react'
import { TaskContext } from './taskContextDefinition'

// Centraliza el acceso al contexto para que los componentes no repitan useContext.
export function useTasks() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTasks debe utilizarse dentro de TaskProvider.')
  }

  return context
}
