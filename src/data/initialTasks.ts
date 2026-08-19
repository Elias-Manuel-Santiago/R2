import type { Task } from '../types/Task'

/** Datos de ejemplo que se muestran durante la primera visita. */
export const initialTasks: Task[] = [
  {
    id: 'bienvenida',
    title: 'Conocer la aplicación',
    description: 'Recorrer la lista, abrir el detalle de una tarea y probar el formulario de creación.',
    createdAt: '2026-08-15T12:00:00.000Z',
    dueDate: '2026-08-18',
    status: 'completed',
  },
  {
    id: 'entrega-practico',
    title: 'Preparar la entrega',
    description: 'Revisar los requisitos del trabajo práctico y comprobar que todas las rutas funcionen correctamente.',
    createdAt: '2026-08-15T14:30:00.000Z',
    dueDate: '2026-08-22',
    status: 'pending',
  },
]
