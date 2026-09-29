// Reordena lo visible y lo refleja en la lista completa
// Los ocultos por el filtro conservan su lugar relativo
import type { Task } from '../types'

export function mergeOrder(
  ordered: Task[],
  visibleIds: string[],
  activeId: string,
  overId: string,
): Task[] {
  const oldIndex = visibleIds.indexOf(activeId)
  const newIndex = visibleIds.indexOf(overId)
  if (oldIndex === -1 || newIndex === -1 || activeId === overId)
    return ordered
  const ids = [...visibleIds]
  const [moved] = ids.splice(oldIndex, 1)
  ids.splice(newIndex, 0, moved)
  const byId = new Map(ordered.map((t) => [t.id, t]))
  const queue: Task[] = []
  for (const id of ids) {
    const task = byId.get(id)
    if (task) queue.push(task)
  }
  return ordered.map((t) =>
    ids.includes(t.id) ? (queue.shift() as Task) : t,
  )
}
