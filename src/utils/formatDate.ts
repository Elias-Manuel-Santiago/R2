/** Convierte la fecha ISO guardada en una fecha fácil de leer. */
export function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

/** Formatea una fecha de calendario sin desplazarla por la zona horaria. */
export function formatDueDate(date: string, dateStyle: 'medium' | 'long' = 'medium') {
  const parsedDate = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-AR', { dateStyle }).format(parsedDate)
}

export function isDueDateOverdue(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const today = new Date()
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')

  return date < localToday
}
