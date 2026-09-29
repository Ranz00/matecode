// Formulario para crear tareas

import { useState, type FormEvent } from 'react'
import type { TaskFormValues, TaskPriority } from '../types'
import { validateDueDate } from '../utils/validation'
import {
  formClass,
  labelClass,
  inputClass,
  primaryBtnClass,
  errorClass,
} from '../styles/theme'

interface Props {
  onAdd: (values: TaskFormValues) => void
  loading: boolean
}

export function TodoForm({ onAdd, loading }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('media')
  const [dueError, setDueError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const dateErr = validateDueDate(dueDate)
    setDueError(dateErr)
    if (dateErr) return
    onAdd({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate + 'T00:00:00') : null,
      priority,
    })
    setTitle('')
    setDescription('')
    setDueDate('')
    setPriority('media')
    setDueError(null)
  }

  return (
    <form onSubmit={handleSubmit} className={`${formClass} mb-6`}>
      <div>
        <label className={labelClass}>Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿Qué tenés que hacer?"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Descripción (opcional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalle breve..."
          className={inputClass}
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className={labelClass}>Vence (opcional)</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onBlur={() => setDueError(validateDueDate(dueDate))}
            className={inputClass}
          />
          {dueError && <p className={errorClass}>{dueError}</p>}
        </div>
        <div className="flex-1">
          <label className={labelClass}>Prioridad</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className={inputClass}
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className={primaryBtnClass}
      >
        {loading ? 'Agregando...' : 'Agregar tarea'}
      </button>
    </form>
  )
}
