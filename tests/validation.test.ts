import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirm,
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

  it('confirmación distinta avisa', () => {
    expect(validateConfirm('abc123', 'abc124')).toBe(
      'Las contraseñas no coinciden',
    )
  })

  it('confirmación igual pasa', () => {
    expect(validateConfirm('abc123', 'abc123')).toBeNull()
  })
})
