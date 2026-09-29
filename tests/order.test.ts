import { describe, it, expect } from 'vitest'
import { mergeOrder } from '../src/utils/order'
import type { Task } from '../src/types'

function task(id: string, completed = false): Task {
  return {
    id,
    title: id,
    description: '',
    completed,
    userId: 'u1',
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: null,
    priority: 'media',
    order: 0,
  }
}

describe('mergeOrder', () => {
  it('mueve el activo a la posición destino', () => {
    const ordered = [task('1'), task('2'), task('3')]
    const ids = mergeOrder(ordered, ['1', '2', '3'], '1', '3').map(
      (t) => t.id,
    )
    expect(ids).toEqual(['2', '3', '1'])
  })

  it('conserva a los ocultos en su lugar', () => {
    const ordered = [task('1'), task('2'), task('3', true)]
    const ids = mergeOrder(ordered, ['1', '2'], '1', '2').map((t) => t.id)
    expect(ids).toEqual(['2', '1', '3'])
  })

  it('devuelve igual si no hay movimiento válido', () => {
    const ordered = [task('1'), task('2')]
    expect(mergeOrder(ordered, ['1', '2'], '1', '1')).toBe(ordered)
    expect(mergeOrder(ordered, ['1', '2'], '9', '2')).toBe(ordered)
  })
})
