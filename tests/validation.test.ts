import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirm,
  validateDueDate,
} from '../src/utils/validation'

describe('validaciones con causa', () => {
  it('email vacío pide ingresarlo', () => {
    expect(validateEmail('')).toBe('Ingresá tu email')
  })

  it('email sin formato explica la causa', () => {
    expect(validateEmail('juan@')).toBe('Email inválido, revisá el formato')
  })

  it('email válido pasa', () => {
    expect(validateEmail('juan@mail.com')).toBeNull()
  })

  it('contraseña corta pide mínimo', () => {
    expect(validatePassword('123')).toBe('Mínimo 6 caracteres')
  })

  it('nombre corto pide mínimo', () => {
    expect(validateName('a')).toBe('Ingresá tu nombre (mínimo 2 caracteres)')
  })

  it('nombre largo pide máximo', () => {
    expect(validateName('a'.repeat(31))).toBe(
      'Ingresá tu nombre (máximo 30 caracteres)',
    )
  })

  it('nombre con números explica la causa', () => {
    expect(validateName('Juan123')).toBe(
      'Solo letras, con un espacio, guion o apóstrofe entre palabras',
    )
  })

  it('nombres compuestos válidos pasan', () => {
    expect(validateName('María José')).toBeNull()
    expect(validateName("O'Brien")).toBeNull()
    expect(validateName('Jean-Pierre')).toBeNull()
  })

  it('separador colgando no pasa', () => {
    expect(validateName("O'")).not.toBeNull()
    expect(validateName('-Juan')).not.toBeNull()
  })

  it('confirmación distinta avisa', () => {
    expect(validateConfirm('abc123', 'abc124')).toBe(
      'Las contraseñas no coinciden',
    )
  })

  it('confirmación igual pasa', () => {
    expect(validateConfirm('abc123', 'abc123')).toBeNull()
  })
})

it('fecha pasada avisa', () => {
  expect(validateDueDate('2000-01-01')).toBe('La fecha no puede ser pasada')
})

it('fecha vacía y futura pasan', () => {
  expect(validateDueDate('')).toBeNull()
  expect(validateDueDate('2099-12-31')).toBeNull()
})

export function validateDueDate(value: string): string | null {
  if (!value) return null
  const picked = new Date(value + 'T00:00:00')
  if (Number.isNaN(picked.getTime())) return 'Fecha inválida'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (picked < today) return 'La fecha no puede ser pasada'
  return null
}
