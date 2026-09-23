import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ToastProvider, useToast } from '../src/components/Toast'

function Probe() {
  const { toast } = useToast()
  return <button onClick={() => toast('Cuenta creada, ¡bienvenido!')}>Avisar</button>
}

describe('Toast', () => {
  it('muestra el mensaje disparado', () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Avisar' }))
    expect(
      screen.getByRole('status', { name: 'Cuenta creada, ¡bienvenido!' }),
    ).toBeInTheDocument()
  })
})
