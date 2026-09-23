import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordInput } from '../src/components/PasswordInput'

describe('PasswordInput', () => {
  it('alterna entre mostrar y ocultar', () => {
    render(
      <PasswordInput label="Password" value="secreto" onChange={() => {}} />,
    )
    const input = screen.getByLabelText('Password') as HTMLInputElement
    expect(input.type).toBe('password')

    fireEvent.click(screen.getByRole('button', { name: /mostrar/i }))
    expect(input.type).toBe('text')
  })

  it('muestra el error recibido', () => {
    render(
      <PasswordInput
        label="Password"
        value=""
        onChange={() => {}}
        error="Mínimo 6 caracteres"
      />,
    )
    expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument()
  })
})
