// Interfaces compartidas en toda la app

export type TaskPriority = 'alta' | 'media' | 'baja'

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
  dueDate: Date | null
  priority: TaskPriority
}

// Valores del formulario de tareas, un solo objeto
export interface TaskFormValues {
  title: string
  description: string
  dueDate: Date | null
  priority: TaskPriority
}
