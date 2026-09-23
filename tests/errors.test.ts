import { describe, it, expect } from 'vitest'
import { traducirError } from '../src/features/auth/authErrors'

describe('traducirError', () => {
  it('retorna mensaje para user-not-found', () => {
    expect(traducirError('auth/user-not-found')).toBe(
      'No existe una cuenta con este email',
    )
  })

  it('retorna mensaje para wrong-password', () => {
    expect(traducirError('auth/wrong-password')).toBe('Contraseña incorrecta')
  })

  it('retorna mensaje para invalid-credential', () => {
    expect(traducirError('auth/invalid-credential')).toBe(
      'Credenciales inválidas, revisá tus datos',
    )
  })

  it('retorna mensaje para popup cerrado por el usuario', () => {
    expect(traducirError('auth/popup-closed-by-user')).toBe(
      'Cerraste la ventana de Google, intentá de nuevo',
    )
  })

  it('retorna mensaje para popup bloqueado', () => {
    expect(traducirError('auth/popup-blocked')).toBe(
      'El navegador bloqueó la ventana, permitila e intentá de nuevo',
    )
  })

  it('retorna mensaje para cuenta deshabilitada', () => {
    expect(traducirError('auth/user-disabled')).toBe(
      'Cuenta deshabilitada, contactá al administrador',
    )
  })

  it('retorna mensaje para método no habilitado', () => {
    expect(traducirError('auth/operation-not-allowed')).toBe(
      'Este método de acceso no está habilitado',
    )
  })

  it('retorna mensaje genérico para error desconocido', () => {
    expect(traducirError('auth/unknown-error')).toBe('Error. Intentá de nuevo.')
  })
})
