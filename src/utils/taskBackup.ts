import type { QuickTask, Task, TaskStatus } from '../types/Task'

const BACKUP_FORMAT = 'r2-task-backup'
const BACKUP_VERSION = 1
const TASK_STATUSES: TaskStatus[] = ['pending', 'in-progress', 'completed']

export type TaskBackup = {
  format: typeof BACKUP_FORMAT
  version: typeof BACKUP_VERSION
  exportedAt: string
  tasks: Task[]
  quickTasks: QuickTask[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyText(value: unknown, maximumLength: number) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maximumLength
}

function isValidDateTime(value: unknown) {
  return typeof value === 'string' && value.length > 0 && !Number.isNaN(Date.parse(value))
}

function isValidDueDate(value: unknown) {
  if (value === '') return true
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) return false

  return isNonEmptyText(value.id, 200)
    && isNonEmptyText(value.title, 80)
    && isNonEmptyText(value.description, 600)
    && isValidDateTime(value.createdAt)
    && isValidDueDate(value.dueDate)
    && typeof value.status === 'string'
    && TASK_STATUSES.includes(value.status as TaskStatus)
}

function isQuickTask(value: unknown): value is QuickTask {
  if (!isRecord(value)) return false

  return isNonEmptyText(value.id, 200)
    && isNonEmptyText(value.title, 80)
    && isNonEmptyText(value.description, 600)
}

function hasUniqueIds(items: Array<{ id: string }>) {
  return new Set(items.map((item) => item.id)).size === items.length
}

export function createTaskBackup(tasks: Task[], quickTasks: QuickTask[]): TaskBackup {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    tasks,
    quickTasks,
  }
}

export function parseTaskBackup(contents: string): TaskBackup {
  let parsed: unknown

  try {
    parsed = JSON.parse(contents)
  } catch {
    throw new Error('El archivo no contiene JSON válido.')
  }

  if (!isRecord(parsed)
    || parsed.format !== BACKUP_FORMAT
    || parsed.version !== BACKUP_VERSION
    || !isValidDateTime(parsed.exportedAt)
    || !Array.isArray(parsed.tasks)
    || !Array.isArray(parsed.quickTasks)
    || !parsed.tasks.every(isTask)
    || !parsed.quickTasks.every(isQuickTask)
    || !hasUniqueIds(parsed.tasks)
    || !hasUniqueIds(parsed.quickTasks)) {
    throw new Error('El archivo no tiene un formato de respaldo válido.')
  }

  return parsed as TaskBackup
}
